# Versioning & Commit Routine Guide

## Version Number Format
Use **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

- **MAJOR** (X.0.0): Breaking changes, incompatible API changes
- **MINOR** (1.X.0): New features, backwards compatible
- **PATCH** (1.0.X): Bug fixes, small improvements, backwards compatible

## When to Update Versions

### PATCH Version (1.0.X)
- Bug fixes
- Code refactoring (no functional changes)
- Documentation updates
- Small UI improvements
- Performance optimizations
- Adding comments or improving code readability

**Examples:**
- Fix DOM selector that stopped working
- Improve error handling
- Rename variables/classes for clarity
- Add logging improvements

### MINOR Version (1.X.0)
- New features
- New functionality
- Significant UI changes
- New configuration options
- New methods or capabilities

**Examples:**
- Add abort button functionality
- Add counter for selecting specific number of invites
- Add user feedback improvements
- Add new DOM handling features

### MAJOR Version (X.0.0)
- Breaking changes to existing functionality
- Complete rewrite of core features
- Changes that require users to reconfigure
- Removal of existing features

**Examples:**
- Change how the script integrates with LinkedIn
- Remove existing button functionality
- Change the core invitation logic significantly

## Commit Routine Checklist

### Before Every Commit:
1. ✅ **Update Version Number**
   ```javascript
   // @version      1.0.X  // Update this line
   ```

2. ✅ **Test the Changes**
   - Load script in Tampermonkey
   - Test on LinkedIn company page
   - Verify functionality works as expected

3. ✅ **Update Changelog** (if you have one)
   - Document what changed
   - Note any breaking changes

4. ✅ **Commit Message Format**
   ```
   v1.0.1: Add version alert and rename class to InviteToFollowCompanyPageInviter
   
   - Added startup alert showing script version
   - Renamed Inviter class to InviteToFollowCompanyPageInviter for clarity
   - Updated all references and log messages
   ```

### Commit Message Template:
```
v[VERSION]: [Brief description of main change]

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]
```

## Current Version History

- **v1.0.0**: Initial release with basic invite selection functionality
- **v1.0.1**: Added version alert and renamed class to InviteToFollowCompanyPageInviter

## Automation Ideas

Consider creating a simple script to help with versioning:

```bash
# Example bash script (version-bump.sh)
#!/bin/bash
VERSION_FILE="invite-to-follow-company-page.user.js"
CURRENT_VERSION=$(grep "@version" $VERSION_FILE | sed 's/.*@version[[:space:]]*//')
echo "Current version: $CURRENT_VERSION"
echo "Enter new version:"
read NEW_VERSION
sed -i "s/@version[[:space:]]*[0-9.]*/@version      $NEW_VERSION/" $VERSION_FILE
echo "Updated to version: $NEW_VERSION"
```

## Best Practices

1. **Always update version before committing**
2. **Test thoroughly after version changes**
3. **Use descriptive commit messages**
4. **Keep a changelog for major releases**
5. **Consider using git tags for releases**
6. **Update version in multiple places if needed** (like the fallback in extractVersion())

## Tampermonkey Specific Notes

- Tampermonkey uses the `@version` metadata to detect updates
- Users will see update notifications when version changes
- Keep versions incremental (don't go backwards)
- Consider adding `@updateURL` and `@downloadURL` for automatic updates
