# PHP

## Instructions

Assume these helper functions are defined elsewhere (e.g., in functions.php)

- `function get_link_type($parameter) { ... }`
- `function get_publication_show_url($publication_uid, $page_uid) { ... }`
- `function get_email_link($email) { ... }`

Also assume `$publication`, `$settings`, and `$showPublicationLinks` are available in scope.

## Block 1

```php
<h2 class="publication__title">
    <?php if ($publication['pid'] != $settings['archivedPublicationsStoragePid']): ?>

        <?php if ($publication['linkType'] == 1): ?>

            <a href="<?= htmlspecialchars($publication['linkIntern']) ?>" class="publication__link">
                <?= htmlspecialchars($publication['title']) ?>
                <svg aria-hidden="true" focusable="false" class="icon publication__icon">
                    <?php if (get_link_type($publication['linkIntern']) == 'url'): ?>
                        <use xlink:href="#diagonal-arrow-right-up"></use>
                    <?php else: ?>
                        <use xlink:href="#arrow-forward"></use>
                    <?php endif; ?>
                </svg>
            </a>
        <?php else: ?>

            <a href="<?= htmlspecialchars(get_publication_show_url($publication['uid'], $settings['publicationPid'])) ?>" class="publication__link">
                <?= htmlspecialchars($publication['title']) ?>
                <svg aria-hidden="true" focusable="false" class="icon publication__icon">
                    <use xlink:href="#arrow-forward"></use>
                </svg>
            </a>
        <?php endif; ?>
    <?php else: ?>

        <a href="<?= htmlspecialchars(get_publication_show_url($publication['uid'], $settings['archivedPublicationPid'])) ?>" class="publication__link">
            <?= htmlspecialchars($publication['title']) ?>
            <svg aria-hidden="true" focusable="false" class="icon publication__icon">
                <use xlink:href="#arrow-forward"></use>
            </svg>
        </a>
    <?php endif; ?>
</h2>
?>
```

## Refactored Snippet

### Issues with the original snippet:
- Deep nesting & duplication: The same <a> block is repeated 3 times, increasing risk of inconsistent changes.
- Mixed concerns: URL selection and rendering are interleaved, making it harder to verify correctness.
- Branching on pid and linkType: Logic is scattered and easier to get wrong during future edits.

### Refactored Snippet
Compute the URL and icon before rendering, then use a single <a> block. This reduces duplication and improves clarity.

```php
<h2 class="publication__title">
    <?php
        $isArchived = ($publication['pid'] == $settings['archivedPublicationsStoragePid']);

        if (!$isArchived && (int)$publication['linkType'] === 1) {
            $url = $publication['linkIntern'];
            $icon = (get_link_type($publication['linkIntern']) === 'url')
                ? '#diagonal-arrow-right-up'
                : '#arrow-forward';
        } else {
            $pagePid = $isArchived
                ? $settings['archivedPublicationPid']
                : $settings['publicationPid'];
            $url = get_publication_show_url($publication['uid'], $pagePid);
            $icon = '#arrow-forward';
        }
    ?>
    <a href="<?= htmlspecialchars($url) ?>" class="publication__link">
        <?= htmlspecialchars($publication['title']) ?>
        <svg aria-hidden="true" focusable="false" class="icon publication__icon">
            <use xlink:href="<?= $icon ?>"></use>
        </svg>
    </a>
</h2>
```

## Block 2

```php
<?php
$has_actions = false;

if ($showPublicationLinks) {
    if ($publication['pdf'] || $publication['htmlUrl'] || $publication['supplementUrl'] || $publication['contactEmail']) {
        $has_actions = true;
    }
} else {
    if ($publication['htmlUrl'] || $publication['supplementUrl'] || $publication['contactEmail']) {
        $has_actions = true;
    }
}
?>
```

## Refactored Snippet

### Issues with the original snippet:

The logic is redundant and partially duplicated. `$has_actions` is set based on multiple conditions that can be combined. `$showPublicationLinks` is only relevant for the PDF check, but the other fields are checked in both branches.

### Refactored Snippet

There is no need to check each condition separately; we can combine them into a single boolean expression. If any of the relevant fields are set, `$has_actions` will be true otherwise false. This simplifies the logic and improves readability, enforces a proper boolean state and makes adding more checks easier.

```php
<?php
$has_actions = (
    ($showPublicationLinks && !empty($publication['pdf'])) ||
    !empty($publication['htmlUrl']) ||
    !empty($publication['supplementUrl']) ||
    !empty($publication['contactEmail'])
) ? true : false;
?>
```

An alternative approach would be to coerce the expression directly to boolean:

```php
<?php
$has_actions = (bool)(
    ($showPublicationLinks && !empty($publication['pdf'])) ||
    !empty($publication['htmlUrl']) ||
    !empty($publication['supplementUrl']) ||
    !empty($publication['contactEmail'])
);
?>

## Block 3

```php
<?php if ($has_actions): ?>
    <?php
        $actions = [
            [
                'enabled'      => $showPublicationLinks && !empty($publication['pdf']),
                'href'         => $publication['pdf'] ?? '',
                'icon'         => '#download',
                'title'        => 'Download PDF',
                'screenreader' => 'Download PDF',
            ],
            [
                'enabled'      => $showPublicationLinks && !empty($publication['htmlUrl']),
                'href'         => $publication['htmlUrl'] ?? '',
                'icon'         => '#external-link',
                'title'        => 'View online',
                'screenreader' => 'View online',
            ],
            [
                'enabled'      => !empty($publication['contactEmail']),
                'href'         => !empty($publication['contactEmail']) ? get_email_link($publication['contactEmail']) : '',
                'icon'         => '#email',
                'title'        => 'E-mail contact',
                'screenreader' => 'E-Mail',
            ],
            [
                'enabled'      => !empty($publication['supplementUrl']),
                'href'         => $publication['supplementUrl'] ?? '',
                'icon'         => '#attachment',
                'title'        => 'Supplementary material',
                'screenreader' => 'Supplementary material',
            ],
        ];
    ?>

    <nav class="publication-actions">
        <ul class="publication-actions__menu">
            <?php foreach ($actions as $action): ?>
                <?php if ($action['enabled']): ?>
                    <li class="publication-actions__menu-item">
                        <a class="publication-actions__link"
                           href="<?= htmlspecialchars($action['href']) ?>"
                           target="_blank"
                           rel="noopener"
                           title="<?= htmlspecialchars($action['title']) ?>">
                            <svg class="icon publication-actions__icon" aria-hidden="true" focusable="false">
                                <use xlink:href="<?= $action['icon'] ?>"></use>
                            </svg>
                            <span class="screen-reader-text"><?= htmlspecialchars($action['screenreader']) ?></span>
                        </a>
                    </li>
                <?php endif; ?>
            <?php endforeach; ?>
        </ul>
    </nav>
<?php endif; ?>
```

## Original Snippet

### Issues with the original snippet:
- Redundancy: The same <li> block is repeated multiple times with only minor changes inviting inconsistency and missed edits.
- Maintainability: Adding or modifying actions requires changes in multiple places.

### Refactored Snippet

We can create an array of actions and loop through them to render the list items. This reduces redundancy and makes it easier to manage the actions. Separating the data from the presentation logic improves maintainability.
Only enabled actions are rendered.
All text is escaped in one place.
Adding a new action now only requires adding a new entry to the `$actions` array.
