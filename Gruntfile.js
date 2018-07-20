module.exports = function(grunt) {

  const path = require('path');
  const argv = require('minimist')(process.argv.slice(2));

  // Pattern Lab configuration(s)
  const config = require('./patternlab-config.json');
  const pl = require('patternlab-node')(config);

  // Helper function(s)
  function paths() {

    return config.paths;

  }
  function getConfiguredCleanOption() {

    return config.cleanPublic;

  }

  // Pattern Lab task(s)
  function patternLabCLI( arg ) {

    if( arguments.length === 0 ) pl.build(function() {}, getConfiguredCleanOption());

    if( arg && arg === 'version' ) pl.version();

    if( arg && arg === "patternsonly" ) pl.patternsonly(function() {}, getConfiguredCleanOption());

    if( arg && arg === "help" ) pl.help();

    if( arg && arg === "liststarterkits" ) pl.liststarterkits();

    if( arg && arg === "loadstarterkit" ) pl.loadstarterkit(argv.kit, argv.clean);

    if( arg && !["version", "patternsonly", "help", "liststarterkits", "loadstarterkits"].include(arg) ) pl.help();

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
        }]
      },
      dev: {
        files: [
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
      dist: {
        files: [
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
          },
          {
            expand: true,
            cwd: path.resolve(paths().source.root),
            src: 'favicon.ico',
            dest: path.resolve(paths().dist.root)
          }
        ]
      },
      ui: {
        files: [
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
          'dart-sass:ui',
          'postcss:ui',
          'cssmin:ui',
          'includes:ui',
          'jshint:ui',
          'babel:ui',
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
          'copy:dev',
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
          'patternlab',
          'copy:dev',
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
          path.resolve(paths().root + '/patternlab-config.json'),
          path.resolve(paths().root + '.eslintrc'),
          path.resolve(paths().root + '.babelrc'),
          path.resolve(paths().root + '.jshintrc')
        ],
        tasks: ['prewatch']
      },
      scss: {
        files: [
          path.resolve(paths().source.scss + '/**'),
        ],
        tasks: [
          'dart-sass:dev',
          'postcss:dev',
          'patternlab',
          'bsReload'
        ]
      },
      js: {
        files: [
          path.resolve(paths().source.js + '/**'),
        ],
        tasks: [
          'jshint:dev',
          'babel:dev',
          'patternlab',
          'bsReload'
        ]
      },
      startup: {
        options: {
          atBegin: true
        },
        files: [],
        tasks: ['prewatch']
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
        }
      }
    },
    'dart-sass': {
      dev: {
        options: {
          style: 'expanded',
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: path.resolve(paths().source.scss),
          src: ['*.scss'],
          dest: path.resolve(paths().public.css),
          ext: '.css'
        }]
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: path.resolve(paths().source.scss),
          src: ['*.scss'],
          dest: path.resolve(paths().dist.css),
          ext: '.css'
        }]
      },
      ui: {
        options: {
          sourceMap: false,
          style: 'expanded'
        },
        files: [
          {
            expand: true,
            cwd: path.resolve(paths().source.styleguide, 'scss/'),
            src: ['styleguide.scss'],
            dest: path.resolve(paths().public.styleguide, 'css/'),
            ext: '.css'
          }
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      dev: [
        path.resolve(paths().source.js, '*.js')
      ],
      ui: [
        path.resolve(paths().source.styleguide, 'js/*.js')
      ]
    },
    babel: {
      options: {
        babelrc: true
      },
      dev: {
        files: [{
          expand: true,
          cwd: path.resolve(paths().source.js),
          src: ['**/*.js'],
          dest: path.resolve(paths().public.js)
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: path.resolve(paths().source.js),
          src: ['**/*.js'],
          dest: path.resolve(paths().dist.js)
        }]
      },
      ui: {
        files: [{
          expand: true,
          cwd: path.resolve(paths().source.styleguide, 'js/'),
          src: ['**/*.js'],
          dest: path.resolve(paths().public.styleguide, 'js/')
        }]
      }
    },
    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: path.resolve(paths().dist.js),
          src: ['**/*.js', '!**/*.min.js'],
          dest: path.resolve(paths().dist.js),
          ext: '.min.js'
        }]
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
      dev: {
        src: path.resolve(paths().public.css, '**/*.css')
      },
      dist: {
        src: path.resolve(paths().dist.css, '**/*.css')
      },
      ui: {
        src: path.resolve(paths().public.styleguide, 'css/**/*.css')
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
          dest: path.resolve(paths().public.styleguide, 'css/'),
          ext: '.min.css'
        }]
      },
      dist: {
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
    gitTag: {
      packageFile: 'package.json'
    }
  });

  // Load tasks
  require('load-grunt-tasks')(grunt);

  // Register tasks
  grunt.registerTask('patternlab', 'Create design systems with atomic design', patternLabCLI);
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('prewatch', [
    'dart-sass:dev',
    'postcss:dev',
    'jshint:dev',
    'babel:dev',
    'dart-sass:ui',
    'postcss:ui',
    'cssmin:ui',
    'includes:ui',
    'jshint:ui',
    'babel:ui',
    'patternlab',
    'copy:dev',
    'copy:ui',
    'bsReload'
  ]);
  grunt.registerTask('init', [
    'copy:init',
    'dart-sass:dev',
    'postcss',
    'includes',
    'patternlab',
    'babel:dev',
    'copy:dev',
    'copy:ui'
  ]);
  grunt.registerTask('dev', [
    'browserSync',
    'watch'
  ]);
  grunt.registerTask('dist', [
    'dart-sass:dist',
    'postcss',
    'cssmin',
    'includes',
    'patternlab',
    'babel:dist',
    'uglify:dist',
    'copy:dist'
  ]);
  grunt.registerTask('release', [
    'dist',
    'git-tag'
  ]);

};
