# Simple blog machine

Basic blog backend with a full REST API and a simple command line tool.

## Installation

```bash
npm install -g sbm
```

## Usage

### Start the service

```bash
sbm start --username AdminUsername --password AdminPassword --port 3000
```

### Login

```bash
sbm login --username AdminUsername --password AdminPassword --url localhost:3000
```

### Create a post

```bash
sbm create post --title "POST TITLE" --content "$(cat /path/to/post/content.md)"
```

### Edit a post

```bash
sbm edit post --content "$(cat /path/to/new/post/content.md)"
```

For more examples, check the [test folder](https://github.com/AgustinCB/sbm/tree/master/test)
