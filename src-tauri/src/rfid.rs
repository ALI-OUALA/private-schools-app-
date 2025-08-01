use serialport::{SerialPort, SerialPortType};
use std::time::Duration;
use anyhow::{Result, anyhow};
use crate::models::RfidScanResult;
use chrono::Utc;

pub struct RfidReader {
    port: Option<Box<dyn SerialPort>>,
    port_name: String,
    baud_rate: u32,
}

impl RfidReader {
    pub fn new(port_name: String, baud_rate: u32) -> Self {
        RfidReader {
            port: None,
            port_name,
            baud_rate,
        }
    }

    pub fn connect(&mut self) -> Result<()> {
        let port = serialport::new(&self.port_name, self.baud_rate)
            .timeout(Duration::from_millis(1000))
            .open()?;

        self.port = Some(port);
        Ok(())
    }

    pub fn disconnect(&mut self) {
        self.port = None;
    }

    pub fn is_connected(&self) -> bool {
        self.port.is_some()
    }

    pub fn scan_card(&mut self) -> Result<String> {
        let port = self.port.as_mut()
            .ok_or_else(|| anyhow!("RFID reader not connected"))?;

        // Send scan command (this depends on your RFID reader protocol)
        let command = b"SCAN\r\n";
        port.write_all(command)?;

        // Read response
        let mut buffer = [0; 32];
        let bytes_read = port.read(&mut buffer)?;
        
        if bytes_read > 0 {
            let response = String::from_utf8_lossy(&buffer[..bytes_read]);
            let card_id = response.trim().to_string();
            
            if !card_id.is_empty() && card_id != "NO_CARD" {
                return Ok(card_id);
            }
        }

        Err(anyhow!("No card detected"))
    }

    pub fn get_available_ports() -> Result<Vec<String>> {
        let ports = serialport::available_ports()?;
        let mut port_names = Vec::new();

        for port in ports {
            match port.port_type {
                SerialPortType::UsbPort(_) => {
                    port_names.push(port.port_name);
                }
                SerialPortType::PciPort => {
                    port_names.push(port.port_name);
                }
                _ => {}
            }
        }

        Ok(port_names)
    }
}
