function createList(items, tag, item_getter) {
    var container = $('<' + tag + '>');
    $.each(items, function (index, value) {

        var elem = item_getter(value);

        $('<li>').append(elem).appendTo(container);
    })
    return container;
}

$.fn.htmlTo = function (elem) {
    $(elem).empty();
    return this.appendTo(elem);
}

$.fn.refreshLayout = function (elem) {
    refreshLayout();
}

function refreshLayout() {
    $("[data-role='navbar']").navbar();
    $('[data-role="listview"]').listview();
    $('[data-role="panel"]').panel();
    $('[data-role="popup"]').popup();
    $("[data-role='footer']").toolbar();
}

function selectListItem(key, value, callback) {
    selected_list_item_key = key;
    selected_list_item_value = value;
    $(".selected-list-item-name").text(value);
    try {
        callback();
    } catch (e) {
        console.log(e);
    }
}

function borrowToFriend() {
    $.mobile.loading("show");
    Friends.load(function (data) {
        createList(
            data,
            'ul',
            function (elem) {
                var value = elem.name;
                return $('<a>').attr({'href': 'javascript:void(0);', 'data-friend-id': elem.id, 'onclick': 'createNewBorrow(' + elem.id + ', selected_list_item_key)'
                }).html(value);
            })
            .attr({'id': 'friends-list', 'data-role': 'listview', 'data-filter': 'true', 'data-filter-placeholder': 'Search...'})
            .htmlTo('#selection-popup')
            .listview().each(function () {
                $.mobile.loading("hide");
                $('#selection-popup').popup().popup("open");
            });
    });
}

function createNewBorrow(friend_id, item_id) {
    if (!confirm("Confirm your borrow")) {
        return;
    }
    $.mobile.loading("show");
    Borrows.create(friend_id, item_id, function (data) {
        $.mobile.loading("hide");
        alert(data.message);
        $('#selection-popup').popup("close");
    })


}

function loadPanelDescription(text) {
    $(".selected-list-item-description").text(text);
}

function openEditItemForm() {
    var item = $.grep(Items.items, function (e) {
        return e.id == selected_list_item_key;
    });
    item = item[0];

    $("#new-item-edit-id").val(selected_list_item_key);
    $("#new-item-title").val(item.title);
    $("#new-item-code").val(item.code);
    $("#new-item-description").val(item.description);
    $.mobile.changePage("#AddItemPage");
}


function openEditFriendForm() {
    var friend = $.grep(Friends.friends, function (e) {
        return e.id == selected_list_item_key;
    });
    friend = friend[0];

    $("#new-friend-edit-id").val(selected_list_item_key);
    $("#new-friend-name").val(friend.name);
    $.mobile.changePage("#AddFriendPage");
}

function resetItemForm() {
    $("#new-item-code").val("");
    $("#new-item-title").val("");
    $("#new-item-description").val("");
    $("#new-item-edit-id").val("");
}

function resetFriendForm() {
    $("#new-friend-name").val("");
    $("#new-friend-edit-id").val("");
}

function deleteItem() {
    if (!confirm("Are you sure?")) {
        return;
    }
    var item_id = selected_list_item_key;
    Items.destroy(item_id, function (data) {
        if (data.status == 1) {
            alert(data.message);
            $.mobile.changePage("#ItemsPage");
            $("#items-panel").panel("close");
        }
    });
}

function deleteFriend() {
    if (!confirm("Are you sure?")) {
        return;
    }
    var friend_id = selected_list_item_key;
    Friends.destroy(friend_id, function (data) {
        if (data.status == 1) {
            alert(data.message);
            $.mobile.changePage("#FriendsPage");
            $("#items-panel").panel("close");
        }
    });
}

function showBorrowedItems() {
    $('#history-list-container').html("");
    Borrows.loadByFriend(selected_list_item_key, function (data) {
        Borrows.borrows = data;
        $.mobile.changePage("#BorrowsPage");
    });

}

function renderDate(dateTime) {
    dateTime = dateTime.split(" ");
    var date = dateTime[0];
    var time = dateTime[1];

    var date = date.split("-");
    var time = time.split(":");

    return date[2] + "." + date[1] + "." + date[0] + " - " + time[0] + ":" + time[1];

}

function refreshPage() {
    jQuery.mobile.changePage(window.location.href, {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
    });
}

function markBorrowReturned(returned) {
    var item_id = selected_list_item_key.item_id;
    var friend_id = selected_list_item_key.friend_id;

    Borrows.markReturned(friend_id, item_id, returned, function (data) {
        if (data.status == 1) {
            alert(data.message);
            $.mobile.changePage("#FriendsPage");

        }
    })

}

function startScan(successCallback, errorCallback) {
    cordova.plugins.barcodeScanner.scan(successCallback, errorCallback);
}

function scanError(error) {
    alert("Scanning failed: " + error);
}

function loadItemCode(result) {
    $("#new-item-code").val(result.text);
}

function quickBorrow(result) {
    $('[data-role="popup"]').popup('close');

    try {
        var item = $.grep(Items.items, function (e) {
            return e.code == result.text
        });
        item = item[0];

        if (confirm("Confirm borrowing item " + item.title)) {
            selectListItem(item.id, item.title, borrowToFriend);
        }
    } catch (e) {
        alert("No item found");
    }
}

function showBorrowHistory() {
    $('#history-list-container').html("");
    Borrows.loadByItem(selected_list_item_key, function (data) {
        Borrows.borrows = data;
        $.mobile.changePage("#HistoryPage");
    });

}