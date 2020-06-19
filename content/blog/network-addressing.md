# Network Addressing Basics

## IPv4

IPv4 address are 32bit with an octet each consisting of 8 bits (hence the 255.255.255.255 limit).

## IPv6

- Leading 0s can be compressed
- Groups of zeroes can be removed (once) and represented by `::`

Example of an `IPv6` address: `2001:0DB8:AC10:FE01:0000:0000:0000:0000` which can be further compressed to be represented as `2001:0DB8:AC10:FE01::`.

The main advantage of IPv6 over IPv4 is the larger address space.

Each segment is represented by 16 bits.

## Media Access Control (MAC) Address

- Within range to max address `FF:FF:FF:FF:FF:FF`.
- 48 bit address.
- First three sections represent the Organizationally Unique Identifier (OUI) - number deontes the manufacturer and whether this is a `universal` or `local` MAC address.
- The MAC addresses are mapped to IP addresses through the `Address Resolution Protocol (ARP)`.

## Address Resolution Protocol (ARP)

When requestion a resolution to an address, a member of the LAN network sends out a broadcast on the network to all devices asking for a `Target` IP but no `Target` MAC address.

The device with the `Target` IP would then respond with a Unicast to the original device provide the `Target` MAC address that was requested..

1. Broadcast => who has IP 192.168.1.212? No `Target` MAC address as it is a broadcast
2. Unicast back => I have the IP 192.168.1.212. Has all `Sender` and `Target` addresses

## Network Masks

Designates which sections of the IP address apply to the network, and which apply to the host.

Example, for `192.168.001.101` we could have Network Portion `255.255.255` and Host Portion `.101`. Only the `101` part of this address is the host portion, so in the above case we know the network is `192.168.001`. The network mask determines the network size and `range`.

In this example the `range` is `192.168.001.0 - 192.168.001.255`.

Note that in a classful network, the `.0` is not a valid IP as it represents a network.

The highest IP in the range isn't used for host assignment as it is consider the `broadcast IP` for broadcasting a packet to an entire IPv4 subnet.

The `broadcast` address also cannot be an even number.

Common network masks include `255.255.255.0`, `255.255.0.0` and `255.0.0.0` where the 255s represent the network portion and the 0s represent the host portion. The are also the submasks of the `A, B and C networks`.

The `network portion` means we can have many networks.

The `host portion` defines how many devices or how many portions you can have on your LAN. This is the only part of the address on a LAN that changes.

### Calculating Subnet Hosts

Formula is `2^n - 2` where n is the number of host bits.

We subtract 2 addresses for the host ID and the broadcast.

### Calculating Subnet Range

We take an IP address and the subnet mask and use an AND calculation on their respective binary representations to figure out the initial IP in the range.

```shell
192.168.100.200 => 11000000 10101000 01100100 11001000
255.255.255.224 => 11111111 11111111 11111111 11100000 (2^5 = 32)
==============================================================
11000000 10101000 01100100 11000000

192.168.100.192 32 addressess = 224

Network Address: 192.168.100.192
Broadcast Address: 192.168.100.223
```

### Calculating Subnets

Formula is `2^b / n+2` where:

- b: number of bits in the host portion
- n: number of hosts per subnet

## CIDR -> Classless Inter-Domain Routing

This is a replacement for classful networking.

- does no use classes for network assignment or sizing
- entire unicast range (0-233 in first octet) can be segmented into any sized network
- subnet masks not limited to `255.255.255.0`, `255.255.0.0` or `255.0.0.0`

CIDR blocks are denoted with an IP address followed by a `/n` where n is a number between 0 and 32 that notes the side of the `host portion`.

Example address `192.168.100.1/24` would be a network that supports 256 host addresses (the last octet).

`192.168.100.1/23` would support 512 host addresses and so on and so forth.
