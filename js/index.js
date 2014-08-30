//var api_url = 'http://192.168.0.17:8000';
var api_url = 'http://95.85.4.199/borrower/public/index.php';

var url_items_list = api_url + "/items";
var url_add_item = api_url + "/items";
var url_delete_item = api_url + "/items/";
var url_update_item = api_url + "/items/";
var url_item_borrows = api_url + "/items/"

var url_add_friend = api_url + "/friends";
var url_friends_list = api_url + "/friends";
var url_update_friend = api_url + "/friends/";
var url_delete_friend = api_url + "/friends/";
var url_friend_borrows = api_url + "/friends/"

var url_add_borrow = api_url + "/borrows";
var url_mark_borrow = api_url + "/borrows/mark";


var selected_list_item_key;
var selected_list_item_value;

var Items = {

    validation_rules: {
        "new-item-title": {
            required: true,
            minlength: 2,
            maxlength: 255
        },

        "new-item-description": {
            required: true,
            minlength: 2,
            maxlength: 255
        }
    },

    items: [],

    load: function (callback) {
        $.ajax({
            type: "GET",
            url: url_items_list,
            cache: false,
            dataType: "jsonp",
            callback: "callback",
            success: function (data) {
                Items.items = data;
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("error");
                console.log(errorThrown)
            }
        });
    },

    add_new: function (callback) {
        var data_title = $("#new-item-title").val();
        var data_description = $("#new-item-description").val();
        var data_code = $("#new-item-code").val();


        $.ajax({
            type: "POST",
            dataType: "json",
            url: url_add_item,
            data: {"title": data_title, "description": data_description, "code": data_code},
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    },

    update: function (callback) {
        var data_title = $("#new-item-title").val();
        var data_description = $("#new-item-description").val();
        var data_id = $("#new-item-edit-id").val();
        var data_code = $("#new-item-code").val();

        $.ajax({
            type: "PUT",
            dataType: "json",
            url: url_update_item + data_id,
            data: {"title": data_title, "description": data_description, "code": data_code},
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    },

    destroy: function (item_id, callback) {
        $.ajax({
            type: "DELETE",
            dataType: "json",
            url: url_delete_item + item_id,
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    }

}

var Friends = {

    friends: [],

    validation_rules: {
        "new-friend-name": {
            required: true,
            minlength: 2,
            maxlength: 255
        }
    },

    load: function (callback, forceAjaxLoad) {
        if (Friends.friends.length == 0 || forceAjaxLoad) {
            console.log("Loading friends");
            $.ajax({
                type: "GET",
                url: url_friends_list,
                cache: false,
                dataType: "jsonp",
                callback: "callback",
                success: function (data) {
                    Friends.friends = data;
                    callback(data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log("error");
                    console.log(errorThrown)
                }
            });
        } else {
            console.log("using old friends");
            callback(Friends.friends);
        }
    },

    add_new: function (callback) {
        var data_name = $("#new-friend-name").val();

        $.ajax({
            type: "POST",
            dataType: "json",
            url: url_add_friend,
            data: {name: data_name},
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    },

    update: function (callback) {
        var data_name = $("#new-friend-name").val();
        var data_id = $("#new-friend-edit-id").val();

        $.ajax({
            type: "PUT",
            dataType: "json",
            url: url_update_friend + data_id,
            data: {name: data_name},
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    },

    destroy: function (friend_id, callback) {
        $.ajax({
            type: "DELETE",
            dataType: "json",
            url: url_delete_friend + friend_id,
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    }
}


var Borrows = {

    borrows: [],

    loadByItem: function (item_id, callback) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url_item_borrows + item_id + "/friends",
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    },

    loadByFriend: function (friend_id, callback) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url_friend_borrows + friend_id + "/items",
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    },

    create: function (p_friend_id, p_item_id, callback) {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: url_add_borrow,
            data: {item_id: p_item_id, friend_id: p_friend_id},
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    },

    markReturned: function (p_friend_id, p_item_id, p_returned, callback) {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: url_mark_borrow,
            data: {item_id: p_item_id, friend_id: p_friend_id, returned: p_returned},
            success: function (data) {
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("error");
                alert(xhr.responseText);
                alert(errorThrown);
            }
        });
    }

}

var app = {

    navigation: null,

    // Application Constructor
    initialize: function () {

        $.support.cors = true;

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.start();
    },

    start: function () {

        var self = this;

        $.extend($.mobile, {
//            hashListeningEnabled: false,
//            linkBindingEnabled: false,
            defaultPageTransition: "slide"
        });

        $("body").on("pagecontainerchange", function (event, ui) {
            requested_page = $('.ui-page-active').attr('id');
            var processingFunctionName = 'self.render_' + requested_page + '()';
            eval(processingFunctionName)
        });

        $("body").on("pagecontainertransition", function (event, ui) {
            $.mobile.loading("show");
        });

        $.mobile.changePage("#ItemsPage");

    },


    render_ItemsPage: function () {
        $("#items-panel").panel("close");

        $(document).off("click", "#items-list-container li a");
        $(document).on("click", "#items-list-container li a", function (e) {
            history.pushState({id: 'PANEL_OPEN'}, '', '');

            e.preventDefault();
            e.stopPropagation();
            var item_id = $(this).attr("data-item-id");
            selectListItem(item_id, $(this).text());

            result = $.grep(Items.items, function (e) {
                return e.id == item_id;
            });

            var item = result[0];
            console.log(item);
            loadPanelDescription(item.description);

            $("#items-panel").panel("open", "#itemsPanel");
        });

        Items.load(function (data) {
            createList(
                data,
                'ul',
                function (elem) {
                    var value = elem.title;
                    return $('<a>').attr({'href': 'javascript:void(0);', 'data-item-id': elem.id}).html(value);
                })
                .attr({'id': 'items-list', 'data-role': 'listview', 'data-filter': 'true', 'data-filter-placeholder': 'Search...'})
                .htmlTo('#items-list-container')
                .listview();
            $.mobile.loading("hide");
        });
    },

    render_FriendsPage: function () {
        $("#friends-panel").panel("close");
        $(document).off("click", "#friends-list-container li a");
        $(document).on("click", "#friends-list-container li a", function (e) {
            e.preventDefault();
            e.stopPropagation();
            history.pushState({id: 'PANEL_OPEN'}, '', '');
            var friend_id = $(this).attr("data-friend-id");
            selectListItem(friend_id, $(this).text());
            $("#friends-panel").panel("open");
        });

        Friends.load(function (data) {
            createList(
                data,
                'ul',
                function (elem) {
                    var value = elem.name;
                    return $('<a>').attr({'href': '#', 'data-friend-id': elem.id}).html(value);
                })
                .attr({'id': 'friends-list', 'data-role': 'listview', 'data-filter': 'true', 'data-filter-placeholder': 'Search...'})
                .htmlTo('#friends-list-container')
                .listview();
            $.mobile.loading("hide");
        }, true);
    },

    render_AddFriendPage: function () {
        $.mobile.loading("hide");
        $("form#new-friend").validate({
            rules: Friends.validation_rules,

            submitHandler: function (form) {
                $.mobile.loading("show");
                if ($("#new-friend-edit-id").val() == "") {
                    Friends.add_new(function (data) {
                        if (data.status == 1) {
                            resetFriendForm();
                            $.mobile.loading("hide");
                            alert(data.message);
                        }
                    });
                } else {
                    Friends.update(function (data) {
                        if (data.status == 1) {
                            resetFriendForm();
                            $.mobile.loading("hide");
                            alert(data.message);
                        }
                    });
                }
            }
        })
    },

    render_AddItemPage: function () {
        $.mobile.loading("hide");

        $("form#new-item").validate({
                rules: Items.validation_rules,

                submitHandler: function (form) {
                    $.mobile.loading("show");
                    if ($("#new-item-edit-id").val() == "") {
                        Items.add_new(function (data) {
                            if (data.status == 1) {
                                resetItemForm();
                            }
                            $.mobile.loading("hide");
                            alert(data.message);
                        });
                    } else {
                        Items.update(function (data) {
                            $.mobile.loading("hide");
                            if (data.status == 1) {
                                resetItemForm();
                                alert(data.message);
                                $.mobile.changePage("#ItemsPage");
                            } else {
                                alert(data.message)
                            }
                        });
                    }

                }
            }
        )
    },

    render_BorrowsPage: function () {
        $(document).off("click", "#borrows-list-container li a");
        $(document).on("click", "#borrows-list-container li a", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var borrow = {
                friend_id: $(this).attr("data-friend-id"),
                item_id: $(this).attr("data-item-id")
            }
            selectListItem(borrow, $(this).find('h2').text());
            $("#borrows-panel").panel("open");
        });

        var listData = Borrows.borrows;

        createList(
            listData,
            'ul',
            function (elem) {
                var date_elem = renderDate(elem.pivot.created_at);
                var css_class = 'not-returned';
                if (elem.pivot.returned_at != '0') {
                    css_class = 'returned';
                    date_elem = date_elem + " - " + renderDate(elem.pivot.returned_at);
                }

                var title = $("<h2>").html(elem.title);
                var content = $("<p>").html(date_elem);

                var a_elem = $('<a>').attr({
                    'href': '#',
                    'data-item-id': elem.pivot.item_id,
                    'data-friend-id': elem.pivot.friend_id,
                    'class': css_class});

                title.appendTo(a_elem);
                content.appendTo(a_elem);

                return a_elem;

            })
            .attr({'id': 'borrows-list', 'data-role': 'listview', 'data-filter': 'true', 'data-filter-placeholder': 'Search...'})
            .htmlTo('#borrows-list-container')
            .listview();
        $.mobile.loading("hide");
    },

    render_HistoryPage: function () {
        var listData = Borrows.borrows;

        createList(
            listData,
            'ul',
            function (elem) {
                var date_elem = renderDate(elem.pivot.created_at);
                var css_class = 'not-returned';
                if (elem.pivot.returned_at != '0') {
                    css_class = 'returned';
                    date_elem = date_elem + " - " + renderDate(elem.pivot.returned_at);
                }

                var title = $("<h2>").html(elem.name);
                console.log(elem);
                var content = $("<p>").html(date_elem);

                var a_elem = $('<a>').attr({
                    'href': '#',
                    'data-item-id': elem.pivot.item_id,
                    'data-friend-id': elem.pivot.friend_id,
                    'class': css_class});

                title.appendTo(a_elem);
                content.appendTo(a_elem);

                return a_elem;

            })
            .attr({'id': 'borrows-list', 'data-role': 'listview', 'data-filter': 'true', 'data-filter-placeholder': 'Search...'})
            .htmlTo('#history-list-container')
            .listview();
        $.mobile.loading("hide");
    }


};