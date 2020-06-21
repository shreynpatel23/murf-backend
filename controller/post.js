const router = require("express").Router();
let Post = require("../modals/post.modal");

router.route("/").get((_, response) => {
  // the below function returns a promise.
  Post.find()
    .then((forum) => response.json(forum))
    .catch((err) => response.json(err));
});

router.route("/new-post").post((request, response) => {
  const id = request.body.id;
  const headerText = request.body.headerText;
  const bodyText = request.body.bodyText;
  const tags = request.body.tags;
  const category = request.body.category;
  const comments = request.body.comments;
  const postedBy = request.body.postedBy;
  const pinned = request.body.pinned;
  const saved = request.body.saved;
  const liked = request.body.liked;
  const newPost = new Post({
    id,
    headerText,
    bodyText,
    tags,
    category,
    comments,
    postedBy,
    pinned,
    saved,
    liked,
  });

  newPost
    .save()
    .then((post) => response.json(post))
    .catch((err) => response.json(err));
});

module.exports = router;
