module.exports = function(grunt) {

  var path = require('path'),
    argv = require('minimist')(process.argv.slice(2));

  //Pattern Lab configurations
  var config = require('./patternlab-config.json'),
    pl = require('patternlab-node')(config);

  // Helper functions
  function paths() {
    return config.paths;
  }

  function getConfiguredCleanOption() {
    return config.cleanPublic;
  }

  // Initialize configurations
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    copy: {
      init: {
        files: [{
          expand: true,
          cwd: path.resolve(paths().styleguideDefault),
          src: ['*', '**'],
          dest: path.resolve(paths().public.root)
        }, ]
      },
      patternlab: {
        files: [{
            expand: true,
            cwd: path.resolve(paths().source.js),
            src: '**/*.js',
            dest: path.resolve(paths().public.js)
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.js),
            src: '**/*.js.map',
            dest: path.resolve(paths().public.js)
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.css),
            src: '*.css',
            dest: path.resolve(paths().public.css)
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.css),
            src: '**/*.css.map',
            dest: path.resolve(paths().public.css)
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.images),
            src: '**/*',
            dest: path.resolve(paths().public.images)
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.fonts),
            src: '**/*',
            dest: path.resolve(paths().public.fonts)
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.root),
            src: 'favicon.ico',
            dest: path.resolve(paths().public.root)
          }
        ]
      },
      build: {
        files: [{
            expand: true,
            cwd: path.resolve(paths().source.js),
            src: '**/*.js',
            dest: path.resolve(paths().dist.js)
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.css),
            src: '**/*.min.css',
            dest: path.resolve(paths().dist.css)
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.images),
            src: '**/*',
            dest: path.resolve(paths().dist.images)
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.fonts),
            src: '**/*',
            dest: path.resolve(paths().dist.fonts)
          }
        ]
      },
      ui: {
        files: [{
            expand: true,
            cwd: path.resolve(paths().source.styleguide, 'css/'),
            src: ['*', '**'],
            dest: path.resolve(paths().public.styleguide, 'css/')
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.styleguide, 'js/'),
            src: ['*', '**'],
            dest: path.resolve(paths().public.styleguide, 'js/')
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.styleguide, 'images/'),
            src: ['*', '**'],
            dest: path.resolve(paths().public.styleguide, 'images/')
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.styleguide, 'fonts/'),
            src: ['*', '**'],
            dest: path.resolve(paths().public.styleguide, 'fonts/')
          }
        ]
      }
    },
    watch: {
      ui: {
        files: [
          path.resolve(paths().source.styleguide + '/**')
        ],
        tasks: [
          'sass:dev',
          'cssmin:ui',
          'includes:ui',
          'patternlab',
          'copy:ui',
          'bsReload'
        ]
      },
      assets: {
        files: [
          path.resolve(paths().source.fonts + '/**'),
          path.resolve(paths().source.images + '/**'),
        ],
        tasks: [
          'patternlab',
          'copy:patternlab',
          'bsReload'
        ]
      },
      patterns: {
        files: [
          path.resolve(paths().source.patterns + '/**'),
          path.resolve(paths().source.data + '/**'),
          path.resolve(paths().source.meta + '/**'),
        ],
        tasks: [
          'run:mustache',
          'patternlab',
          'copy:patternlab',
          'bsReload'
        ]
      },
      config: {
        options: {
          reload: true
        },
        files: [
          path.resolve(paths().source.root + '/*.ico'),
          path.resolve(paths().root + '/Gruntfile.js'),
          path.resolve(paths().root + '/patternlab-config.json')
        ]
      },
      styles: {
        files: [
          path.resolve(paths().source.css + '/**'),
          path.resolve(paths().source.scss + '/**'),
        ],
        tasks: [
          'sass:dev',
          'postcss',
          'run:mustache',
          'patternlab',
          'copy:patternlab',
          'bsReload'
        ]
      },
      scripts: {
        files: [
          path.resolve(paths().source.js + '/**'),
        ],
        tasks: [
          'patternlab',
          'copy:patternlab',
          'bsReload'
        ]
      },
      startup: {
        options: {
          atBegin: true
        },
        files: [],
        tasks: [
          'sass:dev',
          'postcss',
          'cssmin:ui',
          'includes:ui',
          'patternlab',
          'copy:patternlab',
          'copy:ui',
          'bsReload'
        ]
      }
    },
    browserSync: {
      dev: {
        options: {
          open: false,
          server: path.resolve(paths().public.root),
          watchTask: true,
          watchOptions: {
            ignoreInitial: true,
            ignored: '*.html'
          },
          snippetOptions: {
            // Ignore all HTML files within the templates folder
            blacklist: ['/index.html', '/', '/?*']
          },
          plugins: [{
            module: 'bs-html-injector',
            options: {
              files: [path.resolve(paths().public.root + '/index.html'), path.resolve(paths().public.styleguide + '/styleguide.html')]
            }
          }],
          notify: {
            styles: [
              'display: none',
              'padding: 15px',
              'font-family: sans-serif',
              'position: fixed',
              'font-size: 1em',
              'z-index: 9999',
              'bottom: 0px',
              'right: 0px',
              'border-top-left-radius: 5px',
              'background-color: #1B2032',
              'opacity: 0.4',
              'margin: 0',
              'color: white',
              'text-align: center'
            ]
          }
        }
      }
    },
    bsReload: {
      css: path.resolve(paths().public.root + '**/*.css'),
      js: path.resolve(paths().public.root + '**/*.js')
    },
    includes: {
      ui: {
        html: {
          options: {
            includePath: path.resolve(paths().source.styleguide, 'html/partials/')
          },
          files: [{
            cwd: path.resolve(paths().source.styleguide, 'html/'),
            src: 'index.html',
            dest: path.resolve(paths().source.styleguide)
          }]
        },
        js: {
          options: {
            includePath: path.resolve(paths().source.styleguide, 'js/partials/')
          },
          files: [{
            cwd: path.resolve(paths().source.styleguide, 'js/'),
            src: 'index.js',
            dest: path.resolve(paths().source.styleguide)
          }]
        }
      }
    },
    sass: {
      dev: {
        options: {
          noCache: true,
          update: true,
          style: 'expanded',
          sourcemap: 'none'
        },
        files: [{
            expand: true,
            cwd: path.resolve(paths().source.scss),
            src: ['style.scss', 'patternlab.scss'],
            dest: path.resolve(paths().source.css),
            ext: '.css'
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.styleguide, 'scss/'),
            src: ['styleguide.scss'],
            dest: path.resolve(paths().source.styleguide, 'css/'),
            ext: '.css'
          }
        ]
      },
      build: {
        options: {
          noCache: true,
          style: 'compressed'
        },
        files: [{
            expand: true,
            cwd: path.resolve(paths().source.scss),
            src: ['style.scss', 'patternlab.scss'],
            dest: path.resolve(paths().source.css),
            ext: '.css'
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.styleguide, 'scss/'),
            src: ['styleguide.scss'],
            dest: path.resolve(paths().source.styleguide, 'css/'),
            ext: '.css'
          }
        ]
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: 'last 2 versions'
          })
        ]
      },
      css: {
        src: path.resolve(paths().source.css, '**/*.css')
      },
      styleguide: {
        src: path.resolve(paths().source.styleguide, 'css/**/*.css')
      }
    },
    cssmin: {
      ui: {
        options: {
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: path.resolve(paths().source.styleguide, 'css/'),
          src: ['*.css', '!*.min.css'],
          dest: path.resolve(paths().source.styleguide, 'css/'),
          ext: '.min.css'
        }]
      },
      build: {
        options: {
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: path.resolve(paths().source.css),
          src: ['*.css', '!*.min.css'],
          dest: path.resolve(paths().dist.css),
          ext: '.min.css'
        }]
      }
    },
    run: {
      mustache: {
        cmd: 'node',
        args: [
          path.resolve(paths().source.js + '/utils/mustache-preprocessor.js'),
          path.resolve(paths().source.patterns),
          path.resolve(paths().source.meta)
        ]
      }
    },
    gitTag: {
        packageFile: 'package.json'
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-git-tag');

  // Register tasks
  grunt.registerTask('patternlab', 'Create design systems with atomic design', function(arg) {

    if (arguments.length === 0) {
      pl.build(function() {}, getConfiguredCleanOption());
    }

    if (arg && arg === 'version') {
      pl.version();
    }

    if (arg && arg === "patternsonly") {
      pl.patternsonly(function() {}, getConfiguredCleanOption());
    }

    if (arg && arg === "help") {
      pl.help();
    }

    if (arg && arg === "liststarterkits") {
      pl.liststarterkits();
    }

    if (arg && arg === "loadstarterkit") {
      pl.loadstarterkit(argv.kit, argv.clean);
    }

    if (arg && (arg !== "version" && arg !== "patternsonly" && arg !== "help" && arg !== "starterkit-list" && arg !== "starterkit-load")) {
      pl.help();
    }

  });

  grunt.registerTask('default', ['dev']);
  grunt.registerTask('init', [
    'copy:init',
    'sass:build',
    'postcss',
    'run:mustache',
    'includes:ui',
    'patternlab',
    'copy:patternlab',
    'copy:ui'
  ]);
  grunt.registerTask('dev', [
    'browserSync',
    'watch'
  ]);
  grunt.registerTask('build', [
    'sass:build',
    'postcss',
    'cssmin:ui',
    'cssmin:build',
    'run:mustache',
    'includes:ui',
    'patternlab',
    'copy:patternlab',
    'copy:ui',
    'copy:build'
  ]);
  grunt.registerTask('release', [
    'build',
    'git-tag'
  ]);
};
