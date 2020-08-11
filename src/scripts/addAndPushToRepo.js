import { Octokit } from '@octokit/rest';
import glob from 'globby';
import path from 'path';
import { readFileSync } from 'fs';

// const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const owner = 'tariksahni';
const repo = 'tariksahni';

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
const getFileAsUTF8 = (filePath) => readFileSync(filePath, {encoding:'utf8'});

const createBlobForFile = (octo, owner, repo) => async (
    filePath
) => {
    const content = await getFileAsUTF8(filePath);
    console.log("aaua", content);
    const blobData = await octo.git.createBlob({
        owner,
        repo,
        content,
        encoding: 'utf-8',
    });
    console.log("ye aaya", blobData);
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
    // My custom config. Could be taken as parameters
    const tree = blobs.map(({ sha }, index) => ({
        path: paths[index],
        mode: `100644`,
        type: `blob`,
        sha,
    }));
    const { data } = await octo.git.createTree({
        owner,
        repo,
        tree,
        base_tree: parentTreeSha,
    });
    return data
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
    console.log("current", currentCommit);
    const filesPaths = await glob(imagePath);
    console.log("filesPaths", filesPaths, imagePath);
    const filesBlobs = await Promise.all(filesPaths.map(createBlobForFile(octo, owner, repo)));
    console.log("filesPath123", filesBlobs);
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
    const octokit = new Octokit({
        auth: process.env.REPO_TOKEN
    });
    await uploadToRepo(octokit, './src/static/images', owner, repo);
};

export {
    addAndPushToRepo
};