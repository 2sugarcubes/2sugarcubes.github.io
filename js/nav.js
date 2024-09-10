var sectionHeight = function () {
  var total = $(window).height(),
    $section = $("section").css("height", "auto");

  if ($section.outerHeight(true) < total) {
    var margin = $section.outerHeight(true) - $section.height();
    $section.height(total - margin - 20);
  } else {
    $section.css("height", "auto");
  }
};

$(window).resize(sectionHeight);

$(function () {
  $("h1, h2, h3").each(function () {
    $(
      '<a class="nav-button" href="#' +
        $(this).attr("id") +
        '"><i class="fas fa-header"></i><span>' +
        $(this).text() +
        "</span></a>",
    ).insertBefore("#nav-content-highlight");
  });

  $("div ").on("click", "a", function (event) {
    var position = $($(this).attr("href")).offset().top - 40;
    $("html, body").animate({ scrollTop: position }, 400);
    $("nav ul li a").parent().removeClass("active");
    $(this).parent().addClass("active");
    event.preventDefault();
  });

  sectionHeight();

  $("img").on("load", sectionHeight);
});
