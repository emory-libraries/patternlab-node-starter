module.exports = function(grunt) {

  const path = require('path');
  const argv = require('minimist')(process.argv.slice(2));

  // Pattern Lab configuration(s)
  const config = require('./patternlab-config.json');
  const patternlab = require('patternlab-node')(config);
  const pkg = grunt.config.init({pkg: grunt.file.readJSON('package.json')});
  const paths = grunt.config.process(config.paths);

  // Define a list of files to ignore during `uglify`.
  // Paths are relative to the `dist/js/` folder.
  const noUglify = [
    // 'dependencies/foo/foo.js'
  ];

  // Initialize configurations
  grunt.config.merge({
    copy: {
      dev: {
        files: [
          {
            expand: true,
            cwd: path.resolve(paths.source.images),
            src: '**/*',
            dest: path.resolve(paths.public.images)
          },
          {
            expand: true,
            cwd: path.resolve(paths.source.fonts),
            src: '**/*',
            dest: path.resolve(paths.public.fonts)
          },
          {
            expand: true,
            cwd: path.resolve(paths.source.root),
            src: 'favicon.ico',
            dest: path.resolve(paths.public.root)
          },
          {
            expand: true,
            cwd: path.resolve(paths.source.styleguide),
            src: '**/*',
            dest: path.resolve(paths.public.root)
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: path.resolve(paths.source.images),
            src: '**/*',
            dest: path.resolve(paths.dist.images)
          },
          {
            expand: true,
            cwd: path.resolve(paths.source.fonts),
            src: '**/*',
            dest: path.resolve(paths.dist.fonts)
          },
          {
            expand: true,
            cwd: path.resolve(paths.source.root),
            src: 'favicon.ico',
            dest: path.resolve(paths.dist.root)
          }
        ]
      }
    },
    watch: {
      assets: {
        files: [
          path.resolve(paths.source.fonts + '/**'),
          path.resolve(paths.source.images + '/**'),
        ],
        tasks: [
          'patternlab',
          'copy:dev',
          'bsReload'
        ]
      },
      patterns: {
        files: [
          path.resolve(paths.source.patterns + '/**'),
          path.resolve(paths.source.data + '/**'),
          path.resolve(paths.source.meta + '/**'),
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
          path.resolve(paths.source.root + '/*.ico'),
          path.resolve(paths.root + '/Gruntfile.js'),
          path.resolve(paths.root + '/patternlab-config.json'),
          path.resolve(paths.root + '.eslintrc'),
          path.resolve(paths.root + '.babelrc'),
          path.resolve(paths.root + '.jshintrc')
        ],
        tasks: ['prewatch']
      },
      scss: {
        files: [
          path.resolve(paths.source.scss + '/**'),
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
          path.resolve(paths.source.js + '/**'),
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
          open: 'local',
          server: path.resolve(paths.public.root),
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
              files: [path.resolve(paths.public.root + '/index.html'), path.resolve(paths.public.styleguide + '/styleguide.html')]
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
      css: path.resolve(paths.public.root + '**/*.css'),
      js: path.resolve(paths.public.root + '**/*.js')
    },
    'dart-sass': {
      dev: {
        options: {
          style: 'expanded',
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: path.resolve(paths.source.scss),
          src: ['*.scss'],
          dest: path.resolve(paths.public.css),
          ext: '.css'
        }]
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: path.resolve(paths.source.scss),
          src: ['*.scss'],
          dest: path.resolve(paths.dist.css),
          ext: '.css'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      dev: [
        path.resolve(paths.source.js, '*.js')
      ]
    },
    babel: {
      options: {
        babelrc: true
      },
      dev: {
        files: [{
          expand: true,
          cwd: path.resolve(paths.source.js),
          src: ['**/*.js'],
          dest: path.resolve(paths.public.js)
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: path.resolve(paths.source.js),
          src: ['**/*.js'],
          dest: path.resolve(paths.dist.js)
        }]
      }
    },
    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: path.resolve(paths.dist.js),
          src: ['**/*.js', '!**/*.min.js', ...noUglify.map((val) => `!${val}`)],
          dest: path.resolve(paths.dist.js),
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
        src: path.resolve(paths.public.css, '**/*.css')
      },
      dist: {
        src: path.resolve(paths.dist.css, '**/*.css')
      }
    },
    cssmin: {
      dist: {
        options: {
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: path.resolve(paths.source.css),
          src: ['*.css', '!*.min.css'],
          dest: path.resolve(paths.dist.css),
          ext: '.min.css'
        }]
      }
    },
    gitTag: {
      packageFile: 'package.json'
    },
    copydeps: {
      options: {
        unminified: true,
        minified: true
      },
      dev: {
        pkg: 'package.json',
        dest: path.resolve(paths.public.js, 'dependencies/')
      },
      dist: {
        pkg: 'package.json',
        dest: path.resolve(paths.dist.js, 'dependencies/')
      }
    }
  });

  // Load tasks
  require('load-grunt-tasks')(grunt);

  // Register tasks
  grunt.registerTask('patternlab', 'Create design systems with atomic design', function(arg) {

    const done = this.async();

    switch(arg) {

      case 'build': patternlab.build(() => {}, config.cleanPublic); return done();

      case 'version': patternlab.version(); return done();

      case 'patternsonly': patternlab.patternsonly(() => {}, config.cleanPublic); return done();

      case 'liststarterkits': patternlab.liststarterkits(); return done();

      case 'loadstarterkit': patternlab.loadstarterkit(argv.kit, argv.clean); return done();

      default: patternlab.help(); return done();

    }

  });
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('prewatch', [
    'dart-sass:dev',
    'postcss:dev',
    'jshint:dev',
    'babel:dev',
    'patternlab:build',
    'copydeps:dev',
    'copy:dev',
    'bsReload'
  ]);
  grunt.registerTask('dev', [
    'browserSync',
    'watch'
  ]);
  grunt.registerTask('dist', [
    'dart-sass:dist',
    'postcss',
    'cssmin',
    'babel:dist',
    'patternlab:build',
    'copydeps:dist',
    'uglify:dist',
    'copy:dist'
  ]);
  grunt.registerTask('release', [
    'dist',
    'git-tag'
  ]);

};
