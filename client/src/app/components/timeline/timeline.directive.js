(function() {
    'use strict';
    angular
        .module('projectTask')
        .directive('linecontent', linecontent);

    function linecontent() {
        return {
            restrict: 'A',
            replace: false,
            link: function(scope, elem) {
                $(elem).find('[data-line="delete"]').on('click',function(){
                    
                });

                $(elem).find('[data-line="edit"]').on('click',function(){
                    var $title=$(elem).find('[data-line="title"]');
                    var titleHeight=$title[0].offsetHeight;
                    var $content=$(elem).find('[data-line="content"]');
                    var contentHeight=$content[0].offsetHeight;
                    var titleText=$title.text();
                    var contentText=$content.text();
                    $title.empty().append('<input style="font-size: inherit;height:'+titleHeight+'px"  class="form-control" type="text"  >');
                    $title.find('input').val(titleText);
                    $content.empty().append('<textarea class="form-control" style="font-size: inherit;resize:none;height:'+contentHeight+'px">'+contentText+'</textarea>');

                })
            }
        }
    }
})();