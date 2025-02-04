make:
	@bundle install && bundle exec jekyll serve --livereload --open-url --drafts --future --incremental --baseurl=""

make container:
	@wget -qO- https://github.com/2sugarcubes/astrograph/releases/download/v0.1.0/wasm.tar.gz |\
		tar xvz -C js/astro/ --overwrite -o --strip-components 2 \
		&& bundle install \
		&& bundle exec jekyll serve --livereload --drafts --future --incremental --baseurl="" -H jekyll
