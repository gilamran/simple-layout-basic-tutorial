// Generated on 2014-11-27 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Configurable paths
	var config = {
		app: 'app',
		dist: 'dist'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		config: config,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= config.app %>/scripts/{,*/}*.js'],
				tasks: [],
				options: {
					livereload: true
				}
			},
			jstest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['test:watch']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= config.app %>/{,*/}*.html',
					'.tmp/styles/{,*/}*.css',
					'<%= config.app %>/images/{,*/}*'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				open: true,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							connect.static('.tmp'),
							connect.static(config.app)
						];
					}
				}
			},
			test: {
				options: {
					open: false,
					port: 9001,
					middleware: function (connect) {
						return [
							connect.static('.tmp'),
							connect.static('test'),
							connect.static(config.app)
						];
					}
				}
			},
			dist: {
				options: {
					base: '<%= config.dist %>',
					livereload: false
				}
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [
					{
						dot: true,
						src: [
							'.tmp',
							'<%= config.dist %>/*',
							'!<%= config.dist %>/.git*'
						]
					}
				]
			},
			server: '.tmp'
		},

		// Mocha testing framework configuration options
		mocha: {
			all: {
				options: {
					run: true,
					urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
				}
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= config.app %>',
						dest: '<%= config.dist %>',
						src: [
							'*.{ico,png,txt}',
							'images/*.*',
							'scripts/*.*',
							'{,*/}*.html',
							'styles/fonts/{,*/}*.*'
						]
					},
					{
						src: 'node_modules/apache-server-configs/dist/.htaccess',
						dest: '<%= config.dist %>/.htaccess'
					}
				]
			},
			styles: {
				expand: true,
				dot: true,
				cwd: '<%= config.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		'ftp-deploy': {
			build: {
				auth: {
					host: 'simple-layout.com',
					port: 21,
					authKey: 'gil'
				},
				src: 'dist',
				dest: '/public_html/tutorials/basic-tutorial',
				exclusions: ['dist/**/.DS_Store', 'dist/**/Thumbs.db']
			}
		},

		// Run some tasks in parallel to speed up build process
		concurrent: {
			server: [
				'copy:styles'
			],
			test: [
				'copy:styles'
			],
			dist: [
				'copy:styles'
			]
		}
	});


	grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
		if (grunt.option('allow-remote')) {
			grunt.config.set('connect.options.hostname', '0.0.0.0');
		}
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('server', function (target) {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run([target ? ('serve:' + target) : 'serve']);
	});

	grunt.registerTask('test', function (target) {
		if (target !== 'watch') {
			grunt.task.run([
				'clean:server',
				'concurrent:test'
			]);
		}

		grunt.task.run([
			'connect:test',
			'mocha'
		]);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'concurrent:dist',
		'copy:dist'
	]);

	grunt.registerTask('default', [
		'test',
		'build'
	]);
};
