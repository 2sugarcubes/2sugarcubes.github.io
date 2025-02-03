make:
	@bundle install && bundle exec jekyll serve --livereload --open-url --drafts --future --incremental --baseurl=""

make container:
	@bundle install && bundle exec jekyll serve --livereload --drafts --future --incremental --baseurl="" -H jekyll
