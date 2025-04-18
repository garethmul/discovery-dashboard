#!/bin/bash

# Script to remove node_modules from git tracking without deleting the files

# Check if node_modules is being tracked by git
if git ls-files | grep -q "node_modules"; then
  echo "Node modules are currently tracked by git. Removing from git tracking..."
  
  # Remove node_modules from git tracking but keep the files
  git rm -r --cached node_modules
  
  # Make sure .gitignore is properly set up
  if ! grep -q "^/\?node_modules" .gitignore; then
    echo "Adding node_modules to .gitignore..."
    echo "node_modules/" >> .gitignore
  fi
  
  # Commit the changes
  git add .gitignore
  git commit -m "Remove node_modules from git tracking"
  
  echo "Node modules have been removed from git tracking."
  echo "Make sure to push these changes to your repository."
else
  echo "No node_modules directories are being tracked by git. No action needed."
fi 