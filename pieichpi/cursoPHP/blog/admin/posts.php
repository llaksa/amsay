<?php
$query = $pdo->prepare('SELECT * FROM blog_posts ORDER BY id DESC');
$query->execute();

$blogPosts = $query->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>myBlog</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1>Blog Title</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <h2>Posts</h2>
                <a class="btn btn-primary" href="insert-post.php">New Post</a>
                <table class="table">
                    <tr>
                        <th>Title</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    <?php
                        foreach ($blogPosts as $blogPost) {
                            echo '<tr>';
                            echo '<td>' . $blogPost['title'] . '</td>';
                            echo '<td>Edit</td>';
                            echo '<td>Delete</td>';
                            echo '</tr>';
                        }
                    ?>
                </table>
            </div>

            <div class="col-md-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse quia facere rem molestias nostrum, excepturi atque, consequuntur doloribus, ducimus ipsa nihil veniam debitis pariatur quisquam voluptatibus amet. Laudantium, soluta dolore.
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <footer>
                    This a footer <br>
                    <a href="index.php">Admin Panel</a>
                </footer>
            </div>
        </div>
    </div>    
</body>
</html>