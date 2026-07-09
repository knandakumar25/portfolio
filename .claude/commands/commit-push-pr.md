git checkout --branch:auto-update
git add: .
git commit:-m "Apply pending changes"
git push: -u origin auto-update
gh pr create: --title "Apply pending changes" --body "This PR applies pending changes."
