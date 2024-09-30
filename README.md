# Development Branch Workflow

## Overview
The **development** branch serves as our common development branch. It is crucial for integrating various features and changes made by team members. Please follow the guidelines below to ensure a smooth development process.

## Workflow Guidelines

### 1. Pull the Latest Changes
Before making any changes, always ensure that you have the latest version of the **development** branch:

```bash
git checkout development
git pull origin development
```

### 2. Create Your Team Branch
When working on new features or tasks, create a separate branch from the development branch. This allows you to work simultaneously with other team members without conflicts:

```bash
git checkout -b your-team-branch-name
```

### 3. Make Your Changes
Implement your changes in your team branch. Regularly commit your changes with meaningful messages:

```bash
git add .
git commit -m "Describe your changes here"
```

### 4. Sync with the Development Branch
While you are working, periodically pull the latest changes from the development branch to keep your branch up to date and resolve any conflicts:

```bash
git checkout development
git pull origin development
git checkout your-team-branch-name
git merge development
```

### 5. Create Pull Request
Create a Pull Request (PR)
Once your changes are complete and tested, create a Pull Request to merge your team branch back into the development branch. Make sure to:

Clearly describe the changes and their purpose.
Reference any relevant issues or tasks.

### 6. Review and Merge
Review and Merge
After creating a PR, other team members should review the changes. Address any feedback received. Once approved, merge the PR into the development branch.

### 7. Delete Your Team Branch (Optional)
After merging your changes, you may delete your team branch if it's no longer needed:

```bash
git branch -d your-team-branch-name
git push origin --delete your-team-branch-name
```

## Summary
Always start from the development branch.

Create a unique team branch for your work.

Keep your branch updated with the latest changes from development.

Use Pull Requests for merging changes back to the development branch.
