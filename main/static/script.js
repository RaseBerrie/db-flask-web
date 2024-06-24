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

function jsonToCsv(items) {
    const header = Object.keys(items[0]);
    const headerString = ["se", "subdomain", "title", "url", "content"].join('`');

    const replacer = (key, value) => value ?? '';
    const rowItems = items.map((row) =>
        header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join('`')
    );

    const csv = [headerString, ...rowItems].join('\r\n');
    return csv;
}

function downloadFile(url) {
    $("#download").click(function() {
        const link = document.createElement("a");
        link.setAttribute("href", url);
        
        link.setAttribute("download", "data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function sideMenu() {
    $('.summary').click(function() {
        var sideOptions = $(this).siblings('.side-options');
        var icon = $(this).find('.fa-solid');
        
        sideOptions.toggle();
        if (sideOptions.is(':visible')) {
            icon.removeClass('fa-circle-chevron-right');
            icon.addClass('fa-circle-chevron-down');
        } else {
            icon.removeClass('fa-circle-chevron-down');
            icon.addClass('fa-circle-chevron-right');
        }
    })
}

function searchMenu() {
    $('.search-panel .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var concept = $(this).text();
        $('.search-panel span#search-concept').text(concept);
        $('#search-param').val(concept);
    });
}

function topMenu() {
    $('.nav-tabs #drop-btn-1').find('a').click(function(e) {
        e.preventDefault();
        var concept = $(this).text();
        $('#drop-1').text(concept);

        $('#drop-2').text("루트 도메인");
        $('#second-level-menu').html('<li class="dropdown-item"><a href="#" style="pointer-events: none;">회사명을 먼저 선택하세요.</a></li>');

        $('#drop-3').text("서브 도메인");
        $('#third-level-menu').html('<li class="dropdown-item"><a href="#" style="pointer-events: none;">루트 도메인을 먼저 선택하세요.</a></li>');
    });

    $('.nav-tabs #drop-btn-2').find('a').click(function(e) {
        e.preventDefault();
        var concept = $(this).text();
        $('#drop-2').text(concept);

        $('#drop-3').text("서브 도메인");
        $('#third-level-menu').html('<li class="dropdown-item"><a href="#" style="pointer-events: none;">루트 도메인을 먼저 선택하세요.</a></li>');
    });

    $('.nav-tabs #drop-btn-3').find('a').click(function(e) {
        e.preventDefault();
        var concept = $(this).text();
        $('#drop-3').text(concept);
    });
}

function loadInitiateResults(reset) {
    if (loading) return;
    loading = true;
    $('#loading').show();

    $.get("/")
}

function loadInitiateResultsbck(reset) {
    if (loading) return;
    loading = true;
    $('#loading').show();

    $.get("/index", { page: page }, function(data) {
        if (reset) {
            endofdata = false
            $('.total-count').html(data.count[0]);
            $('#results').append('<tbody>');
        }

        const csv = jsonToCsv(data.data_full_list);
        console.log(csv);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf8mb4;'});
        const csvUrl = URL.createObjectURL(blob);
        
        let html = "";
        $.each(data.data_list, function(index, row) {
            html += '<tr>';
            html += '<td>' + row[1] + ' <span id="tag">' + row[0] + '</span></td>'
            html += '<td>' + row[2] + '</td>';
            html += '<td><a href="' + row[3] + '">' + row[3].slice(0, 30);
            html += '...</a></td>';
            if (row[4].length > 40) {
                html += `<td>
                <div class="show-less">` + row[4].slice(0, 40) + `... 
                    <button class="see-more" id="tag" style="border: none; background-color: #B9BBBF">더보기</button>
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
        downloadFile(csvUrl);

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
            
            const csv = jsonToCsv(data.data_full_list);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf8mb4;'});
            const csvUrl = URL.createObjectURL(blob);

            let html = "";
            $.each(data.data_list, function(index, row) {
                html += '<tr>';
                html += '<td>' + row[1] + ' <span id="tag">' + row[0] + '</span></td>';
                html += '<td>' + row[2] + '</td>';
                html += '<td><a href="' + row[3] + '">' + row[3].slice(0, 30);
                html += '...</a></td>';
                if (row[4].length > 40) {
                    html += `<td>
                    <div class="show-less">` + row[4].slice(0, 40) + `... 
                        <button class="see-more" id="tag" style="border: none;">더보기</button>
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

            loading = false;
            page++;

            searchMenu();
            foldableButton();
            downloadFile(csvUrl);

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