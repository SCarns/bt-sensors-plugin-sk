const BTSensor = require("../BTSensor");
const LYWSD03MMC = require('./LYWSD03MMC.js')
class RUUVI extends BTSensor{

    constructor(device){
        super(device)
    }

    static metadata = LYWSD03MMC.metadata
    
    connect() {
        const cb = async (propertiesChanged) => {
            try{
                this.device.getServiceData().then((data)=>{             
                    //TBD Check if the service ID is universal across ATC variants
                    const buff=data['0000181a-0000-1000-8000-00805f9b34fb'];
                    this.emit("temp",((buff.readInt16LE(1))/100) + 273.1);
                    this.emit("humidity",buff.readUInt16LE(3)/10000);
                    this.emit("pressure",buff.readUInt16LE(5)/1000);
                    this.emit("accel-x",buff.readUInt16LE(5));
                    this.emit("accel-y",buff.readUInt16LE(5));
                    this.emit("accel-z",buff.readUInt16LE(5));
                })
            }
            catch (error) {
                throw new Error(`Unable to read data from ${util.inspect(device)}: ${error}` )
            }
        }
        cb();
        this.device.helper.on('PropertiesChanged', cb)
    }
}
module.exports=ATC
