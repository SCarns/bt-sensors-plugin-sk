const BTSensor = require("../BTSensor");

class Ruuvi extends BTSensor{

    static needsScannerOn(){
        return false
    }
    static metadata = new Map()
                    .set('temp',{unit:'K', description: 'temperature'})
                    .set('humidity',{unit:'ratio', description: 'humidity'})
                    .set('pressure',{unit:'Pa', description: 'pressure'})
                    .set('accel-x',{unit:'', description: 'acceleration-x'})  
                    .set('accel-y',{unit:'', description: 'acceleration-y'})
                    .set('accel-z',{unit:'', description: 'acceleration-z'})
                    .set('rssi',{unit:'', description: 'transmit power'})
                    .set('voltage',{unit:'V', description: 'sensor battery voltage'})

    constructor(device){
        super(device)
    }

    emitValues(buffer){
        this.emit("temp",((buffer.readInt16LE(10))/100) + 273.1);
        this.emit("humidity",buffer.readUInt8(10)/100);
        this.emit("pressure",buffer.readUInt8(0)/100);
        this.emit("accel-x",buffer.readUInt8(0));
        this.emit("accel-y",buffer.readUInt8(0));
        this.emit("accel-z",buffer.readUInt8(0));
        this.emit("rssi",buffer.readUInt8(0));
        this.emit("voltage",buffer.readUInt16LE(0)/1000);
    }

    async connect() {
        await this.device.connect()
        var gattServer = await this.device.gatt()
        var gattService = await gattServer.getPrimaryService("ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6")
        var gattCharacteristic = await gattService.getCharacteristic("ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6")
        this.emitValues(await gattCharacteristic.readValue())
        await gattCharacteristic.startNotifications();	
        gattCharacteristic.on('valuechanged', buffer => {
            this.emitValues(buffer)
        })
    }
    async disconnect(){
        super.disconnect()
        await this.device.disconnect()
    }
}
module.exports=LYWSD03MMC
