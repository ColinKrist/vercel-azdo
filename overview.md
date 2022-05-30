# Vercel for Azure DevOps

This extension provides Azure Devops Pipelines Tasks to integrate with Vercel using their @vercel/cli npm package

#### About Vercel: [link🔗](https://vercel.com/docs)


---

## Usage

> Contrary to Vercel's documentation, don't add the .vercel directory to your .gitignore file. This extension uses the project.json file to automatically detect which project to publish your repo to in Vercel

### First Time Vercel Users (generating API token)

1. Follow and run locally in your project https://vercel.com/docs/cli#introduction/project-linking

1. 



### Existing Vercel Project


---

## Recommended patterns / recipes

### Deploy on PR

> If coming from Github, Gitlab, or Bitbucket this is likely the section for you

To accomplish publishing a comment on a PR other extensions must be used in conjuncture with this extension. The purpose of this extension is to publish and expose the URL output in a variable for usage elsewhere.

#### Needed Extensions

| Name | Link | Author(s) |
| - | - | - |
| Create Pull Request Comment | [link](https://github.com/microsoft/CSEDevOps/tree/main/CreatePrComment) | Microsoft's CSE Dev Team |

#### Example Yaml

TODO using sample repo