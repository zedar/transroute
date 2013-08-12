var profile = (function(){
  var testResourceRe = /^app\/tests\//;

    var ignore = function(filename, mid){
        var list = {
            "app/.gitignore" : true
        };
        return (mid in list) ||
            /^app\/vendor\//.test(mid);
    };

    var test = function(filename, mid){
        var list = {
            "app/tests"     : true
        };
        return (mid in list) ||
            testResourceRe.test(mid);
    };

    var copyOnly = function(filename, mid){
        var list = {
      "app/app.profile" : true,
            "app/package.json"      : true,
            "app/LICENSE"           : true,
            "app/README.md"         : true
        };
        return (mid in list) ||
            /(png|jpg|jpeg|gif|tiff)$/.test(filename);
    };

    var miniExclude = function(filename, mid){
        var list = {
            "app/LICENCE"   : true,
            "app/README.md" : true
        };
        return (mid in list);
    };

    return {
        resourceTags:{

            ignore: function(filename, mid){
        return ignore(filename, mid);
            },

            test: function(filename, mid){
        return test(filename, mid);
            },

            copyOnly: function(filename, mid){
                return copyOnly(filename, mid);
            },

            miniExclude: function(filename, mid){
                return miniExclude(filename, mid);
            },

            amd: function(filename, mid){
                return !test(filename, mid) &&
                    !copyOnly(filename, mid) &&
                    !ignore(filename, mid) &&
                    (/\.js$/).test(filename);
            }
        }
    };
})();