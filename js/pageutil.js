function loadHeaderAndFooterMenu(htmlImportLinkID, slotID, headerMenuID, footerMenuID)
{
    window.addEventListener('HTMLImportsLoaded', function(e) {
        var hm = document.querySelector(htmlImportLinkID);
        if((headerMenuID != undefined)&&(headerMenuID != ''))
        {
          var headerMenu = hm.import.querySelector(headerMenuID);
          document.getElementById(slotID).prepend(document.importNode(headerMenu, true));
        }
        if((footerMenuID != undefined)&&(footerMenuID != ''))
        {
          var footerMenu = hm.import.querySelector(footerMenuID);
          document.getElementById(slotID).appendChild(document.importNode(footerMenu, true));
        }
        
        // script to make menu and sub-menus work 
        var t = $(".mobile-menu-button")
        , n = $(".menu");
        $(t).on("click", function(t) {
          t.preventDefault();
          n.slideToggle()
        });
        $(".menu > li > a").click(function(n) {
          window.innerWidth <= 768 && (n.preventDefault(),
          $(".sub-menu").slideUp(),
          $(this).next().is(":visible") || $(this).next().slideDown())
        });
        var i = function() {
          return /ipad/i.test(navigator.userAgent)
        }
        , r = function() {
          return /iphone/i.test(navigator.userAgent)
        }
        , u = function() {
          return /ipod/i.test(navigator.userAgent)
        }
        , f = u() || i() || r() ? "touchstart" : "click";
        $("body").bind(f, function(t) {
          $(t.target).closest("nav").length === 0 && $(t.target).closest(".mobile-menu").length === 0 && ($(".sub-menu").slideUp(),
          window.innerWidth < 768 && n.slideUp())
        });
        $("ul.menu > li").hover(function(n) {
          window.innerWidth > 768 && (n.preventDefault(),
          $(this).find(".sub-menu").slideDown(),
          $(this).children("a:first").removeClass("menu-head"),
          $(this).children("a:first").addClass("menu-head-over"))
        }, function(n) {
          window.innerWidth > 768 && (n.preventDefault(),
          $(".sub-menu").hide(),
          $(this).children("a:first").removeClass("menu-head-over"),
          $(this).children("a:first").addClass("menu-head"))
        });
        $(window).resize(function() {
          window.innerWidth >= 768 && n.removeAttr("style")
        })
    });
}