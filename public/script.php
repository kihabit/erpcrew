<?php



use Illuminate\Contracts\Console\Kernel;

require dirname(__DIR__) . '/vendor/autoload.php';

$app = require_once dirname(__DIR__) . '/bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$commands = [
    'optimize:clear',
    'view:clear',
    'config:clear',
    'route:clear',
    'cache:clear',

    // Re-publish Filament assets
    'filament:assets',
];

foreach ($commands as $command) {
    echo "<h3>{$command}</h3>";

    try {
        $kernel->call($command);

        echo '<pre>';
        echo htmlspecialchars($kernel->output());
        echo '</pre>';
    } catch (\Throwable $e) {
        echo '<pre style="color:red;">';
        echo htmlspecialchars($e->getMessage());
        echo '</pre>';
    }
}

echo '<h2>Completed</h2>';