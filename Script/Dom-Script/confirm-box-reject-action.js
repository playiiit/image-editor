// -------------------------------
// Confirm Box Reject Action
// -------------------------------
try {
    ByID('confirm-box-reject').addEventListener('click', function () {
        location.reload();
    });
} catch (e) {
    // console.log(e);
}