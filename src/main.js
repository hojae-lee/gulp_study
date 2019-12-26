window.onload = function() {
    alert("안녕하세요");
    var jbBtn = document.createElement( 'button' );
    var jbBtnText = document.createTextNode( 'Click' );
    jbBtn.appendChild( jbBtnText );
    document.body.appendChild( jbBtn );
}