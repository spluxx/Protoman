import { GrpcRequestDescriptor } from './request';
import { ChannelDescriptor, ChannelInitiator } from './channel';
import { makeClientConstructor, Client, Channel } from '@grpc/grpc-js';
import { ServiceClientConstructor, ServiceDefinition, ServiceClient } from '@grpc/grpc-js/build/src/make-client';

function makeServiceDefinition(): ServiceDefinition {}

export async function createChannel(channelInitiator: ChannelInitiator): Promise<ChannelDescriptor> {
  const serviceClientConstructor: ServiceClientConstructor = makeClientConstructor(
    makeServiceDefinition(),
    channelInitiator.serviceType.name,
    channelInitiator.options,
  );

  const client: Client = new serviceClientConstructor(
    channelInitiator.url,
    channelInitiator.credentials,
    channelInitiator.options,
  );

  const channelDescriptor: ChannelDescriptor = {
    channelInitiator: channelInitiator,
    id: 0, //randomly generate a number that can identify the client
    client: client,
  };
  return channelDescriptor;
}

export function makeRequest(request: GrpcRequestDescriptor) {
  //   var service = new proto.mypackage.EchoServiceClient('http://localhost:8080');
  //   return null;
  //   var request = new proto.mypackage.EchoRequest();
  //   request.setMessage(msg);
  //   var metadata = { 'custom-header-1': 'value1' };
  //   var call = echoService.echo(request, metadata, function(err, response) {
  //     if (err) {
  //       console.log(err.code);
  //       console.log(err.message);
  //     } else {
  //       console.log(response.getMessage());
  //     }
  //   });
  //   call.on('status', function(status) {
  //     console.log(status.code);
  //     console.log(status.details);
  //     console.log(status.metadata);
  //   });
}

export function handleResponse();
