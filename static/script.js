HTML_THEAD = `<thead>
                <tr>
                    <th>서브도메인</th>
                    <th>제목</th>
                    <th>URL</th>
                    <th>콘텐츠</th>
                </tr>
            </thead> <tbody>`

function scrollTop() {
    if ($(window).scrollTop() > 500) {
        $(".backToTopBtn").addClass("active");
    } else {
        $(".backToTopBtn").removeClass("active"); }}
    $(function () {
        scrollTop();
        $(window).on("scroll", scrollTop);

    $(".backToTopBtn").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1);
        return false;
    });
});

$('ul li').on('click', function() {
    $('li').removeClass('active');
    $(this).addClass('active');
});

function foldableButton() {
    $('.see-more').click(function() {
        $(this).parent('.show-less').hide();
        $(this).parent('.show-less').siblings('.show-more').show();
    });

    $('.see-less').click(function() {
        $(this).parent('.show-more').hide();
        $(this).parent('.show-more').siblings('.show-less').show();
    });
}

function searchMenu() {
    $('.search-panel .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var concept = $(this).text();
        $('.search-panel span#search-concept').text(concept);
        $('#search-param').val(concept);
    });
}
