"use strict";
/* global define, app, config, RELATIVE_PATH */

define('forum/login', ['translator'], function(translator) {
	var	Login = {};

	Login.init = function() {
		var errorEl = $('#login-error-notify'),
			submitEl = $('#login'),
			formEl = $('#login-form');

		submitEl.on('click', function(e) {
			e.preventDefault();

			if (!$('#username').val() || !$('#password').val()) {
				errorEl.find('p').translateText('[[error:invalid-username-or-password]]');
				errorEl.show();
			} else {
				errorEl.hide();

				if (submitEl.hasClass('disabled')) {
					return;
				}

				submitEl.addClass('disabled');
				formEl.ajaxSubmit({
					headers: {
						'x-csrf-token': config.csrf_token
					},
					success: function(data, status) {
						window.location.href = data + '?loggedin';
					},
					error: function(data, status) {
						if (data.status === 403 && data.responseText === 'Forbidden') {
							window.location.href = config.relative_path + '/login?error=csrf-invalid';
						} else {
							errorEl.find('p').translateText(data.responseText);
							errorEl.show();
							submitEl.removeClass('disabled');

							// Select the entire password if that field has focus
							if ($('#password:focus').size()) {
								$('#password').select();
							}
						}
					}
				});
			}
		});

		$('#login-error-notify button').on('click', function(e) {
			e.preventDefault();
			errorEl.hide();
			return false;
		});

		if ($('#content #username').attr('readonly')) {
			$('#content #password').val('').focus();
		} else {
			$('#content #username').focus();
		}


		// Add "returnTo" data if present
		if (app.previousUrl && $('#returnTo').length === 0) {
			var returnToEl = document.createElement('input');
			returnToEl.type = 'hidden';
			returnToEl.name = 'returnTo';
			returnToEl.id = 'returnTo';
			returnToEl.value = app.previousUrl;
			$(returnToEl).appendTo(formEl);
		}
	};

	return Login;
});
