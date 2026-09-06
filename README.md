# README

## Requirements

- Ruby 3.4.x

On macOS with Homebrew:

```sh
brew install ruby@3.4
export PATH="/opt/homebrew/opt/ruby@3.4/bin:$PATH"
ruby --version
```

The reported version must begin with `ruby 3.4`. Add the `PATH` export to your
shell profile to make it persistent. Version managers such as `mise`, `rbenv`,
and `asdf` can use the repository's `.ruby-version` file instead.

## Installation

```sh
bundle install
```

## Developing

```sh
bundle exec jekyll serve
```

## Testing

```sh
JEKYLL_ENV=production bundle exec jekyll build
bundle exec htmlproofer _site --disable-external
```
