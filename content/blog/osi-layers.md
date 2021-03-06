---
title: OSI Layers
date: "2019-06-24"
description: A quick overview on the seven layers of the Open System Interconnection (OSI) model.
---

A quick and dirty on the seven layers of the OSI Model.



## OSI Layers in Network Traffic

### Layer 1: Physical

Represents the bit-level transmission between network nodes over the connection medium.

Data: Bits across the wire (1s and 0s) as pulse of electricity or light.

### Layer 2: Data Link

Data Link Layer handles communications between adjacents network nodes via physical addressing (MAC).

Data: Frames.

### Layer 3: Network

Handles routing messages (packets) via the best route to reach its destination based on IP address.

Data: Packets.

### Layer 4: Transport

Defines how data will be sent providing validation and security.

Data: Segments.

### Layer 5-7: Application, Presentation, Session

Layers 5-7 are typically managed by the application itself, providing the interface for the user to communicate.

Data: Data.



## Data in a TCP/IP Example

- Data Link Layer (2): Frame = Frame Header + Frame Data
- Network Layer (3): Packet = IP Header + IP Data
- Transport Layer (4): Segment = TCP Header + Application Data
- Application Layer (5-7): Data = App Header + User Data

When dealing with subnetting, network masks etc, note that you are working in the `Network Layer` (layer 3).
