---
title: Blog
---

This is a catch all for my miscellaneous musing.

<ul>
  {% for post in site.categories.blog %}
  <li>
    <time class="post-time" datetime="{{ post.date }}"
      >{{ post.date | date_to_string }}</time
    >
    <a href="{{ post.url }}">{{ post.title }}</a>
  </li>
  <p>{{ post.excerpt }}</p>
  {% endfor %}
</ul>
