var enbBemTechs = require('enb-bem-techs'),
    borschikTech = require('enb-borschik/techs/borschik'),
    isProd = process.env.YENV === 'production',
    bhOptions = {
        jsAttrName: 'data-bem',
        jsAttrScheme: 'json'
    };

module.exports = function (config) {
    config.includeConfig('enb-bem-tmpl-specs');

    config.module('enb-bem-tmpl-specs').createConfigurator('tmpl-specs').configure({
        destPath: 'desktop.tmpl-specs',
        levels: ['common.blocks', 'desktop.blocks'],
        sourceLevels: getDesktops(),
        engines: {
            'bh@4': {
                tech: 'enb-bh/techs/bh-commonjs',
                options: { bhOptions: bhOptions }
            },
            'bh@3': {
                tech: 'enb-bh/techs/bh-commonjs',
                options: {
                    bhFilename: require.resolve('bh/lib/bh.js'),
                    bhOptions: bhOptions
                }
            },
            'bemhtml-dev': {
                tech: 'enb-bemxjst/techs/bemhtml',
                options: { devMode: true }
            },
            'bemhtml-prod': {
                tech: 'enb-bemxjst/techs/bemhtml',
                options: { devMode: false }
            },
            'bemhtml@bem-xjst-4': {
                tech: 'enb-bemxjst-2/techs/bemhtml',
                options: { exportName: 'BEMHTML' }
            }
        },
        depsTech: enbBemTechs.deps
    });

    config.nodes('*.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [require('enb/techs/file-provider'), { target: '?.bemjson.js' }],
            [enbBemTechs.files],
            [enbBemTechs.deps],
            [enbBemTechs.bemjsonToBemdecl],
            // ie.css
            [require('enb/techs/css'), {
                target: '?.ie.css',
                sourceSuffixes: ['css', 'ie.css']
            }],
            // ie8.css
            [require('enb/techs/css'), {
                target: '?.ie8.css',
                sourceSuffixes: ['css', 'ie8.css']
            }],
            // ie9.css
            [require('enb/techs/css'), {
                target: '?.ie9.css',
                sourceSuffixes: ['css', 'ie9.css']
            }],
            // browser.js
            [require('enb-diverse-js/techs/browser-js'), { target: '?.browser.js' }],
            [require('enb/techs/file-merge'), {
                target: '?.pre.js',
                sources: ['?.browser.bh.js', '?.browser.js']
            }],
            [require('enb-modules/techs/prepend-modules'), {
                source: '?.pre.js',
                target: '?.js'
            }],
            // bh
            [require('enb-bh/techs/bh-commonjs'), {
                bhOptions: bhOptions,
                mimic: ['bh', 'BEMHTML']
            }],
            // client bh
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.bh.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.bh.deps.js',
                bemdeclFile: '?.bh.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.bh.deps.js',
                filesTarget: '?.bh.files',
                dirsTarget: '?.bh.dirs'
            }],
            [require('enb-bh/techs/bh-bundle'), {
                target: '?.browser.bh.js',
                filesTarget: '?.bh.files',
                bhOptions: bhOptions,
                mimic: ['bh', 'BEMHTML']
            }],
            // html
            [require('enb-bh/techs/bemjson-to-html')],
            // borschik
            [borschikTech, { sourceTarget: '?.css', destTarget: '?.min.css', tech: 'cleancss', minify: isProd }],
            [borschikTech, { sourceTarget: '?.ie.css', destTarget: '?.ie.min.css', minify: isProd }],
            [borschikTech, { sourceTarget: '?.ie8.css', destTarget: '?.ie8.min.css', minify: isProd }],
            [borschikTech, { sourceTarget: '?.ie9.css', destTarget: '?.ie9.min.css', minify: isProd }],
            [borschikTech, { sourceTarget: '?.js', destTarget: '?.min.js', minify: isProd }],
            [borschikTech, { sourceTarget: '?.bh.js', destTarget: '?.bh.min.js', minify: isProd }]
        ]);

        nodeConfig.addTargets([
            '?.min.css',
            '?.ie.min.css',
            '?.ie8.min.css',
            '?.ie9.min.css',
            '?.min.js',
            '?.bh.min.js',
            '?.html'
        ]);
    });

    config.nodes('*desktop.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getDesktops() }],
            // css
            [require('enb-stylus/techs/stylus'), {
                autoprefixer: { browsers: ['ie >= 10', 'last 2 versions', 'opera 12.1', '> 2%'] }
            }]
        ]);
    });

    config.nodes('*touch-pad.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getTouchPads() }],
            // css
            [require('enb-stylus/techs/stylus'), {
                autoprefixer: { browsers: ['android 4', 'ios 5'] }
            }]
        ]);
    });

    config.nodes('*touch-phone.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getTouchPhones() }],
            // css
            [require('enb-stylus/techs/stylus'), {
                autoprefixer: { browserSupport: ['android 4', 'ios 6', 'ie 10'] }
            }]
        ]);
    });

};

function getDesktops() {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/desktop.blocks', check: false },
        'common.blocks',
        'desktop.blocks'
    ];
}

function getTouchPads() {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/touch.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch-pad.blocks', check: false },
        'common.blocks',
        'touch.blocks'
    ];
}

function getTouchPhones() {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/touch.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch-phone.blocks', check: false },
        'common.blocks',
        'touch.blocks',
        'touch-phone.blocks'
    ];
}
