(function(spacebounce) {

  function Sensor() {
  }

  var p = Sensor.prototype = new Object();

  p.getClassName = function() {
    return Sensor.name;
  }

  spacebounce.Sensor = Sensor;

}(spacebounce));
