---
title: Kubernetes Healthchecks
date: "2019-07-24"
description: An example of a simple health check for Kubernetes.
---

# Healthchecks in Kubernetes

If the application malfunctions, the pod and container may still be running but the application may no longer be running. This is where health checks come in.

## Two types of health checks

1.  Running a command in the container periodically
2.  Periodic checks on a URL

The typical prod application behind a load balancer should always have health checks implemented in some way to ensure availability and resiliency.

Below you can see where the healthcheck is. You can check the port or container port name.

```yaml
# pod-helloworld.yml
apiVersion: v1
kind: Pod
metadata:
  name: nodehelloworld.example.com
  labels:
  app: helloworld
spec:
  # The containers are listed here
  containers:
    - name: k8s-demo
      image: okeeffed/docker-demo
      ports:
        - containerPort: 3000
      # ! This is the health check
      livenessProbe:
        httpGet:
          path: /
          port: 3000
        initialDelaySeconds: 15
        timeoutSeconds: 30
```

More explicit information can be [found here](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).
