function scrollTop() {
    if ($(window).scrollTop() > 500) {
        $(".backToTopBtn").addClass("active");
    } else {
        $(".backToTopBtn").removeClass("active");
    }}
    $(function() {
        scrollTop();
        $(window).on("scroll", scrollTop);

    $(".backToTopBtn").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1);
        return false;
    });
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

function submitForm(query) {
    $('#searchInput').val(query);
    $('#submitButton').trigger("click");
}

function loadInitiateResults(reset) {
    if (loading) return;
    loading = true;
    $('#loading').show();

    $.get("/index", { page: page }, function(data) {
        if (reset) {
            endofdata = false
            $('.total-count').html(data.count[0]);
            $('.login.count').html(data.count[1]);
            $('.admin.count').html(data.count[2]);
            $('#results').append('<tbody>');
        }
        
        let html = "";
        $.each(data.data_list, function(index, row) {
            html += '<tr>';
            html += '<td>' + row[1] + ' <span id="tag"';
            if (row[0] === "Google") {html += ' style="background-color: CornflowerBlue;">'+ row[0] + '</span></td>'}
            else {html += ' style="background-color: coral;">'+ row[0] + '</span></td>'};
            row[0] + '</span></td>';
            html += '<td>' + row[2] + '</td>';
            html += '<td><a href="' + row[3] + '">' + row[3].slice(0, 30);
            html += '...</a></td>';
            if (row[4].length > 40) {
                html += `<td>
                <div class="show-less">` + row[4].slice(0, 40) + `... 
                    <button class="see-more" id="tag" style="border: none; background-color: #aaa">더보기</button>
                </div>
                <div class="show-more" style="display:none">` + row[4] +
                    `<button class="see-less" id="tag" style="border: none;">접기</button>
                </div></td>`;
            } else {
                html += '<td>' + row[4] + '</td>';
            }
            html += '</tr>';
        });
        html += '</tbody>'
        $('#results').append(html);
        $('#loading').hide();

        searchMenu();
        foldableButton();

        loading = false;
        page++;

        let pagecount = 0;
        pagecount = parseInt(data.count[0]) / 20;
        if (page > pagecount + 1) endofdata = true;
    });
    return endofdata;
}

function loadResults(reset) {
    if (loading) return;
    loading = true;
    $('#loading').show();
    const menu = $('#search-param').val();
    let param;

    switch(menu) {
        case "서브도메인":
            param = 'subdomain';
            break;
        case "제목":
            param = 'title';
            break;
        case "URL":
            param = 'url';
            break;
        case "콘텐츠":
            param = 'content';
            break;
        default:
            param = '';
    }

    const query = $('#searchInput').val();
    if (query) {
        $.get("/search", { menu: param, key: query, page: page }, function(data) {
            if (reset) {
                endofdata = false
                $('.total-count').html(data.count[0]);
                $('#results').append('<tbody>');
            }
            
            let html = "";
            $.each(data.data_list, function(index, row) {
                html += '<tr>';
                html += '<td>' + row[1] + ' <span id="tag"';
                if (row[0] === "Google") {html += ' style="background-color: CornflowerBlue;">'+ row[0] + '</span></td>'}
                else {html += ' style="background-color: coral;">'+ row[0] + '</span></td>'};
                row[0] + '</span></td>';
                html += '<td>' + row[2] + '</td>';
                html += '<td><a href="' + row[3] + '">' + row[3].slice(0, 30);
                html += '...</a></td>';
                if (row[4].length > 40) {
                    html += `<td>
                    <div class="show-less">` + row[4].slice(0, 40) + `... 
                        <button class="see-more" id="tag" style="border: none; background-color: #aaa">더보기</button>
                    </div>
                    <div class="show-more" style="display:none">` + row[4] +
                        `<button class="see-less" id="tag" style="border: none;">접기</button>
                    </div></td>`;
                } else {
                    html += '<td>' + row[4] + '</td>';
                }
                html += '</tr>';
            });
            html += '</tbody>'

            $('#results').append(html);
            $('#loading').hide();

            searchMenu();
            foldableButton();

            loading = false;
            page++;

            let pagecount = 0;
            pagecount = parseInt(data.count[0]) / 20;
            if (page > pagecount + 1) endofdata = true;
        });
    } else {
        $('#loading').hide();
        loading = false;
    }
    return endofdata;
}