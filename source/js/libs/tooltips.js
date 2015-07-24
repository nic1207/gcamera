/*
 * TOOLTIPS
 */
//$( function() {
  var targets = $( '[rel~=tooltip]' ),
  target	= false,
  tooltip = false,
  title	= false;
  function showAllToolTips() {
    targets = $( '[rel~=tooltip]' );
    //console.log("targets.length=",targets.length);
    targets.each(function() {
      show($(this));
      });
  }
  function hideAllToolTips() {
    //console.log("hide!!!",targets);
    targets = $( '[rel~=tooltip]' );
    //console.log("targets.length=",targets.length);
    targets.each(function() {         
      hide($(this));
    });
  }
  
  //targets.bind( 'touchstart', function() {
  function show(target) {
    if(!target)
      return;
    tip	= target.attr( 'title' );
    tooltip	= document.createElement("div");//$( '<div class="tooltip"></div>' );
    tooltip.className = "tooltip";
    tooltip.id = target.attr('id') + "_t";
    console.log("tooltip.id=",tooltip.id);
    if( !tip || tip == '' )
      return false;

    $(tooltip).css( 'opacity', 0 ).html( tip ).appendTo( 'body' );

    var init_tooltip = function() {
      if( $( window ).width() < $(tooltip).outerWidth() * 1.5 )
        $(tooltip).css( 'max-width', $( window ).width() / 2 );
      else
        $(tooltip).css( 'max-width', 340 );

      var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( $(tooltip).outerWidth() / 2 ),
      pos_top	 = target.offset().top - $(tooltip).outerHeight() - 20;
                                                                                                                                                                              
      if( pos_left < 0 ) {
        pos_left = target.offset().left + target.outerWidth() / 2 - 20;
        $(tooltip).addClass( 'left' );
      } else
        $(tooltip).removeClass( 'left' );
      if( pos_left + $(tooltip).outerWidth() > $( window ).width() ) {
        pos_left = target.offset().left - $(tooltip).outerWidth() + target.outerWidth() / 2 + 20;
        $(tooltip).addClass( 'right' );
      } else
        $(tooltip).removeClass( 'right' );
      if( pos_top < 0 ) {
        var pos_top	 = target.offset().top + target.outerHeight();
        $(tooltip).addClass( 'top' );
      } else
        $(tooltip).removeClass( 'top' );
      $(tooltip).css( { left: pos_left, top: pos_top } ).animate( { top: '+=10', opacity: 1 }, 50 );
    };
    
    init_tooltip();
    $( window ).resize( init_tooltip );
  };
  function hide(target) {
    var tt = $("#"+target.get(0).id + "_t");
    tt.animate( { top: '-=10', opacity: 0 }, 50, function() {
      $(this).remove();
    });
    //target.attr( 'title', tip );
  };
