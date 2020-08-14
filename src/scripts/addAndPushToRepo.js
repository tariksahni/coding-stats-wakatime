import { Octokit } from '@octokit/rest';
import { createActionAuth } from "@octokit/auth-action";
import glob from 'globby';
import path from 'path';
import { readFile } from 'fs-extra';

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

const getCurrentCommit = async (
    octo,
    owner,
    repo,
    branch
) => {
    const { data: refData } = await octo.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`,
    });
    const commitSha = refData.object.sha;
    const { data: commitData } = await octo.git.getCommit({
        owner,
        repo,
        commit_sha: commitSha,
    });
    return {
        commitSha,
        treeSha: commitData.tree.sha,
    }
};

// Notice that readFile's utf8 is typed differently from Github's utf-8
const getFileAsUTF8 = (filePath) => readFile(filePath, 'utf8');

const createBlobForFile = (octo, owner, repo) => async (
    filePath
) => {
    const content = await getFileAsUTF8(filePath);
    const blobData = await octo.git.createBlob({
        owner,
        repo,
        content,
        encoding: 'utf-8',
    });
    return blobData.data
};

const createNewTree = async (
    octo,
    owner,
    repo,
    blobs,
    paths,
    parentTreeSha
) => {
    const tree = blobs.map(({ sha }, index) => ({
        path: paths[index],
        mode: `100644`,
        type: `blob`,
        sha,
    }));
    const responseFromCreateTree = await octo.git.createTree({
        owner,
        repo,
        tree,
        base_tree: parentTreeSha,
    });
    return responseFromCreateTree.data
};

const createNewCommit = async (
    octo,
    owner,
    repo,
    message,
    currentTreeSha,
    currentCommitSha
) =>
    (await octo.git.createCommit({
        owner,
        repo,
        message,
        tree: currentTreeSha,
        parents: [currentCommitSha],
    })).data;

const setBranchToCommit = (
    octo,
    owner,
    repo,
    branch = `master`,
    commitSha
) =>
    octo.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: commitSha,
    });

const uploadToRepo = async (
    octo,
    imagePath,
    owner,
    repo,
    branch = 'master'
) => {
    const currentCommit = await getCurrentCommit(octo, owner, repo, branch);
    const filesPaths = await glob(imagePath);
    const filesBlobs = await Promise.all(filesPaths.map(createBlobForFile(octo, owner, repo)));
    const pathsForBlobs = filesPaths.map(fullPath => path.relative(imagePath, fullPath));
    const newTree = await createNewTree(
        octo,
        owner,
        repo,
        filesBlobs,
        pathsForBlobs,
        currentCommit.treeSha
    );
    const commitMessage = 'Updated your coding stats :rocket: ';
    const newCommit = await createNewCommit(
        octo,
        owner,
        repo,
        commitMessage,
        newTree.sha,
        currentCommit.commitSha
    );
    await setBranchToCommit(octo, owner, repo, branch, newCommit.sha)
};

const addAndPushToRepo = async () => {
    const auth = createActionAuth();
    const { token } = await auth();
    const octokit = new Octokit({
        auth: token
    });
    await uploadToRepo(octokit, './src/static/images', owner, repo);
};

export {
    addAndPushToRepo
};