var puntaje=0;
var movimientos=0;
var contadorDulces=0;
var minuto=2;
var segundo=0;
var contador=0;
var arregloColimnas=["","","","","","",""];
var arregloFilas=["","","","","","",""];
var tableroPartida=0;
var sumaTotal=0;
var contadorHorizontal=0;
var contadorVerfical=0;
var limite=0;
var periodo=0;
var borrar=0;
var acumDulces=0;
var tiempo=0;
var aplza=0;

$(document).ready(function() {
     setInterval(function(){
      $(".main-titulo").switchClass("main-titulo","main-titulo-cambio", 800),
      $(".main-titulo").switchClass("main-titulo-cambio","main-titulo", 800)
    }, 1000);
});

$(".btn-reinicio").click(function(){
	$(this).html("Reiniciar")
	contador = 0;
	puntaje = 0;
	movimientos = 0;
	minuto = 2;
	segundo = 0;
	$(".panel-score").css("width","25%");
	$(".panel-tablero").show();
	$(".time").show();
	$("#score-text").html("0");
	$("#movimientos-text").html("0");
	clearInterval(periodo);
	clearInterval(borrar);
	clearInterval(acumDulces);
	clearInterval(tiempo);
	borrarTodo();
	periodo=setInterval(function(){
		llenarTablero()
	},200);
	tiempo=setInterval(function(){
		temporizador()
	},1000);
});

function llenarTablero(){
	contador = contador + 1
	var n = 0;
	var imagen = 0;
	$(".elemento").draggable({disabled:true});
	if(contador < 8){
		for(var m = 1; m < 8; m++){
			if($(".col-" + m).children("img:nth-child(" + contador + ")").html() == null){
				n=Math.floor(Math.random()* 4) + 1;
				imagen="image/" + n + ".png";
				$(".col-" + m).prepend("<img src=" + imagen + " class='elemento'/>").css("justify-content","flex-start")
			}
		}
	}
	if(contador == 8){
  	clearInterval(periodo);
  	borrar=setInterval(function(){
  		borrarDulces()
  	},100);
  }
};

function temporizador(){
	if(segundo != 0){
		segundo = segundo - 1;
	}
	if(segundo == 0){
		if(minuto == 0){
			clearInterval(borrar);
			clearInterval(acumDulces);
			clearInterval(periodo);
			clearInterval(tiempo);
			$(".panel-tablero").hide("drop","slow",ampliarMarcador);
			$(".time").hide();
		}
		segundo = 59;
		minuto = minuto - 1;
	}
  if(segundo>9){
    $("#timer").html("0" + minuto + ":" + segundo);
  }else{
    $("#timer").html("0" + minuto + ":0" + segundo);
  }
};

function ampliarMarcador(){
	$(".panel-score").animate({width:'100%'},1000);
};

function borrarTodo(){
	for(var p = 1; p < 8; p++){
		$(".col-" + p).children("img").detach();}
};

$.fn.swap=function(before){
	before = $(before)[0];
	var after = this[0];
	var temp=after.parentNode.insertBefore(document.createTextNode(''), after);
	before.parentNode.insertBefore(after, before);
	temp.parentNode.insertBefore(before, temp);
	temp.parentNode.removeChild(t);
	return this;
};

function borrarDulces(){
	tableroPartida=0;
	contadorHorizontal=buscarHorizontal();
	contadorVerfical=buscarVertical();

	for(var r = 1; r < 8; r++){
		tableroPartida=tableroPartida+$(".col-" + r).children().length;
	}

	if(contadorHorizontal == 0 && contadorVerfical == 0 && tableroPartida!= 49){
		clearInterval(borrar);
		contadorDulces = 0;
		acumDulces=setInterval(function(){
			nuevosdulces()
		},200);
	}

	if(contadorHorizontal == 1 || contadorVerfical == 1){
		$(".elemento").draggable({disabled:true});
		$("div[class^='col']").css("justify-content","flex-end");
		$(".activo").hide("pulsate",1000,function(){
			var puntajeTemp = $(".activo").length;
			$(".activo").remove("img");
			puntaje = puntaje + puntajeTemp * 10;
			$("#score-text").html(puntaje);
		});
	}

	if(contadorHorizontal == 0 && contadorVerfical == 0 && tableroPartida == 49){
		$(".elemento").draggable({
			disabled: false,
			containment: ".panel-tablero",
			revert: true,
			revertDuration: 0,
			snap: ".elemento",
			snapMode: "inner",
			snapTolerance: 40,
			start: function(event, ui){
				movimientos=movimientos + 1;
				$("#movimientos-text").html(movimientos);
			}
		});
	}

	$(".elemento").droppable({
		drop:function (event,ui){
			var dropped = ui.draggable;
			var droppedOn = this;
			aplza = 0;
			do{
				aplza=dropped.swap($(droppedOn));
			}while(aplza == 0);
			contadorHorizontal = buscarHorizontal();
			contadorVerfical = buscarVertical();
			if(contadorHorizontal == 0 && contadorVerfical == 0){
				dropped.swap($(droppedOn));}
			if(contadorHorizontal==1 || contadorVerfical==1){
				clearInterval(acumDulces);
				clearInterval(borrar);
				borrar=setInterval(function(){
					borrarDulces()
				},150);
			}
		},
	});
};



function buscarHorizontal(){
	var banderaHorizontal=0;
	for(var  m =1; m   <  8; m ++){
		for(var  n =1; n  < 6; n ++){
			var dulce_1=$(".col-"+ n ).children("img:nth-last-child("+ m +")").attr("src");
			var dulce_2=$(".col-"+( n +1)).children("img:nth-last-child("+ m +")").attr("src");
			var dulce_3=$(".col-"+( n +2)).children("img:nth-last-child("+ m +")").attr("src");
			if((dulce_1==dulce_2) && (dulce_2==dulce_3) && (dulce_1!=null) && (dulce_2!=null) && (dulce_3!=null)){
				$(".col-"+ n ).children("img:nth-last-child("+( m )+")").attr("class","elemento activo");
				$(".col-"+( n +1)).children("img:nth-last-child("+( m )+")").attr("class","elemento activo");
				$(".col-"+( n +2)).children("img:nth-last-child("+( m )+")").attr("class","elemento activo");
				banderaHorizontal=1;
			}
		}
	}
	return banderaHorizontal;
};

function buscarVertical(){
	var banderaVertical=0;
	for(var m=1;m < 6;m++){
		for(var  n =1; n  < 8; n ++){
			var dulce_1=$(".col-"+ n ).children("img:nth-child("+m+")").attr("src");
			var dulce_2=$(".col-"+ n ).children("img:nth-child("+(m+1)+")").attr("src");
			var dulce_3=$(".col-"+ n ).children("img:nth-child("+(m+2)+")").attr("src");
			if((dulce_1==dulce_2) && (dulce_2==dulce_3) && (dulce_1!=null) && (dulce_2!=null) && (dulce_3!=null)){
				$(".col-"+ n ).children("img:nth-child("+(m)+")").attr("class","elemento activo");
				$(".col-"+ n ).children("img:nth-child("+(m+1)+")").attr("class","elemento activo");
				$(".col-"+ n ).children("img:nth-child("+(m+2)+")").attr("class","elemento activo");
				banderaVertical=1;
			}
		}
	}
	return banderaVertical;
};

function nuevosdulces(){
	$(".elemento").draggable({disabled:true});
	$("div[class^='col']").css("justify-content","flex-start")
	for(var r = 1; r < 8; r++){
		arregloColimnas[ r-1 ] = $(".col-"+ r).children().length;
	}
	if(contadorDulces==0){
		for(var r = 0; r < 7; r++){
		arregloFilas[r]=(7-arregloColimnas[r]);}
		limite=Math.max.apply(null, arregloFilas);
		sumaTotal = limite;
	}
	if(limite!= 0){
		if(contadorDulces == 1){
			for(var r = 1; r < 8; r++){
				if(sumaTotal>(limite - arregloFilas[ r-1 ])){
					$(".col-"+ r).children("img:nth-child("+ (arregloFilas[ r-1 ]) + ")" ).remove("img");
				}
			}
		}
		if(contadorDulces == 0){
			contadorDulces = 1;
			for(var k = 1; k < 8; k++){
				for(var r = 0; r < (arregloFilas[ k-1 ] - 1); r++){
					$(".col-"+ k).prepend("<img src='' class='elemento' style='visibility:hidden'/>");
				}
			}
		}
		for(var r = 1; r < 8; r++){
			if(sumaTotal > ( limite - arregloFilas[ r-1 ])){
				n = Math.floor(Math.random()* 4) + 1;
				imagen = "image/" + n + ".png";
				$(".col-"+ r).prepend("<img src=" + imagen + " class='elemento'/>");
			}
		}
	}
	if(sumaTotal == 1){
		clearInterval(acumDulces);
		borrar = setInterval(function(){
			borrarDulces()
		},150);
	}
	sumaTotal=sumaTotal-1;
};
