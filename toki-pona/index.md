---
title: toki pona
layout: toki-pona
---

toki a! kama pona tawa lipu mi pi+ toki-pona. sina ken oko ala e toki INLIlon
sewi. ni li lon lipu ale. kin, sina ken oko e sitelen pona anu toki pona
lon sewi.

<p class="english" lang="en-au">
  Hey there! Welcome to my toki pona pages. If you want you can toggle between
  english and sitelen pona up there, it will be there on all pages. You can
  also toggle between sitelen pona and toki pona using the Latin alphabet.
</p>

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
