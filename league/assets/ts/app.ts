/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/knockout/knockout.d.ts" />
/// <reference path="viewmodel.ts" />

window.onload = () => {
    var postViewModel = new League.ViewModels.PostViewModel();

    ko.applyBindings(postViewModel);

    postViewModel.getData();
};