var enbBemTechs = require('enb-bem-techs'),
    borschikTech = require('enb-borschik/techs/borschik'),
    isProd = process.env.YENV === 'production';

module.exports = function (config) {
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
            // css
            [require('enb-stylus/techs/css-stylus'), { target: '?.noprefix.css' }],
            // bh
            [require('enb-bh/techs/bh-server'), {
                jsAttrName: 'data-bem',
                jsAttrScheme: 'json'
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
            [require('enb-bh/techs/bh-client-module'), {
                target: '?.browser.bh.js',
                filesTarget: '?.bh.files',
                jsAttrName: 'data-bem',
                jsAttrScheme: 'json',
                mimic: 'BEMHTML'
            }],
            // html
            [require('enb-bh/techs/html-from-bemjson')],
            // borschik
            [borschikTech, { sourceTarget: '?.css', destTarget: '_?.css', tech: 'cleancss', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.ie.css', destTarget: '_?.ie.css', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.ie8.css', destTarget: '_?.ie8.css', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.ie9.css', destTarget: '_?.ie9.css', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.js', destTarget: '_?.js', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.bh.js', destTarget: '_?.bh.js', freeze: true, minify: isProd }]
        ]);

        nodeConfig.addTargets([
            '_?.css',
            '_?.ie.css',
            '_?.ie8.css',
            '_?.ie9.css',
            '_?.js',
            '_?.bh.js',
            '?.html'
        ]);
    });

    config.nodes('*desktop.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getDesktops(config) }],
            // autoprefixer
            [require('enb-autoprefixer/techs/css-autoprefixer'), {
                browserSupport: ['last 2 versions', 'ie 10', 'ff 24', 'opera 12.16'],
                sourceTarget: '?.noprefix.css'
            }]
        ]);
    });

    config.nodes('*touch-pad.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getTouchPads(config) }],
            // autoprefixer
            [require('enb-autoprefixer/techs/css-autoprefixer'), {
                browserSupport: ['android 4', 'ios 5'],
                sourceTarget: '?.noprefix.css'
            }]
        ]);
    });

    config.nodes('*touch-phone.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getTouchPhones(config) }],
            // autoprefixer
            [require('enb-autoprefixer/techs/css-autoprefixer'), {
                browserSupport: ['android 4', 'ios 6', 'ie 10'],
                sourceTarget: '?.noprefix.css'
            }]
        ]);
    });

};

function getDesktops(config) {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/desktop.blocks', check: false },
        'common.blocks',
        'desktop.blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}

function getTouchPads(config) {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/touch.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch-pad.blocks', check: false },
        'common.blocks',
        'touch.blocks',
        'touch-pad.blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}

function getTouchPhones(config) {
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
    ].map(function (level) {
        return config.resolvePath(level);
    });
}
