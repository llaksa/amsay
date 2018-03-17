<?php

namespace app\models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model {
    protected $table = 'blog_posts';
    protected $fillable = ['title', 'content', 'img_url'];
}

