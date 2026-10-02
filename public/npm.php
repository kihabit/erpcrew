<?php



$root = __DIR__;
$search = 'NEXT_PUBLIC_LARAVEL_API_URL';

echo "<h2>Searching for: {$search}</h2>";

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS)
);

$found = 0;

foreach ($iterator as $file) {

    if (!$file->isFile()) {
        continue;
    }

    $path = $file->getPathname();

    // Only search frontend text/JS files
    if (!preg_match('/\.(js|json|html|css|map|txt)$/i', $path)) {
        continue;
    }

    $contents = @file_get_contents($path);

    if ($contents === false) {
        continue;
    }

    if (stripos($contents, $search) !== false) {

        $found++;

        echo "<hr>";
        echo "<b>FOUND:</b> " . htmlspecialchars($path) . "<br>";

        $pos = stripos($contents, $search);

        $start = max(0, $pos - 300);
        $snippet = substr($contents, $start, 700);

        echo "<pre style='white-space:pre-wrap;background:#eee;padding:10px'>";
        echo htmlspecialchars($snippet);
        echo "</pre>";
    }
}

echo "<hr>";
echo "<h3>Total files found: {$found}</h3>";