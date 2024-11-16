import React, { useEffect, useState } from 'react';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { useAccount, useWalletClient } from 'wagmi';

const PushGroupManager = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [pushUser, setPushUser] = useState<PushAPI | null>(null);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [stream, setStream] = useState<any>(null);

  // Group Creation States
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [memberAddress, setMemberAddress] = useState('');
  const [membersList, setMembersList] = useState<string[]>([]);

  // Group Loading States
  const [groupId, setGroupId] = useState('');
  const [currentGroup, setCurrentGroup] = useState<any>(null);

  // Initialize Push User
  useEffect(() => {
    const initPushUser = async () => {
      if (!walletClient) return;
      
      try {
        const user = await PushAPI.initialize(walletClient, {
          env: CONSTANTS.ENV.STAGING,
        });
        setPushUser(user);

        // Initialize stream
        const newStream = await user.initStream([CONSTANTS.STREAM.CHAT]);
        newStream.on(CONSTANTS.STREAM.CHAT, (message: any) => {
            if (message.content !== "...") {
                setMessages(prev => [...prev, message]);
              }
        });
        newStream.connect();
        setStream(newStream);

        return () => {
          if (newStream) {
            newStream.disconnect();
          }
        };
      } catch (error) {
        console.error('Error initializing Push:', error);
      }
    };

    initPushUser();
  }, [walletClient]);

  // Create Group
  const createGroup = async () => {
    if (!pushUser || !groupName) return;

    try {
      const newGroup = await pushUser.chat.group.create(groupName, {
        image: "data:image/jpeg;base64,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",
        description: groupDescription,
        members: membersList,
        private: false,
      });

      console.log('Created group:', newGroup);
      // Clear form
      setGroupName('');
      setGroupDescription('');
      setMembersList([]);
      setMemberAddress('');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  // Load Group
  const loadGroup = async () => {
    if (!pushUser || !groupId) return;

    try {
      const groupInfo = await pushUser.chat.group.info(groupId);
      setCurrentGroup(groupInfo);
      
      // Load group messages
      const history = await pushUser.chat.history(groupId);
      setMessages(history);
    } catch (error) {
      console.error('Error loading group:', error);
    }
  };

  // Send Message
  // Modify the sendMessage function
const sendMessage = async () => {
    if (!pushUser || !groupId || !newMessage) return;
  
    try {
      console.log('Sending message:', {
        groupId,
        content: newMessage,
        type: 'Text'
      });
  
      const response = await pushUser.chat.send(groupId, {
        content: newMessage,
        type: 'Text',
      });
  
      // Log the full response
      console.log('Message sent successfully:', response);
  
      // Optional: Add the message to the local state immediately
      const newMsg = {
        content: newMessage,
        timestamp: Date.now(),
        ...response // spread any additional fields from response
      };
      setMessages(prev => [...prev, newMsg]);
  
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Optionally show error to user
      alert('Failed to send message: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-4 space-y-6">
      {/* Create Group Section */}
      <div className="border rounded-lg p-4 bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Create New Group</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          
          <input
            type="text"
            placeholder="Group Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Member Address"
              value={memberAddress}
              onChange={(e) => setMemberAddress(e.target.value)}
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              onClick={() => {
                if (memberAddress) {
                  setMembersList([...membersList, memberAddress]);
                  setMemberAddress('');
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Member
            </button>
          </div>

          {membersList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {membersList.map((member, index) => (
                <div key={index} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
                  <span>{member.slice(0, 6)}...{member.slice(-4)}</span>
                  <button
                    onClick={() => setMembersList(membersList.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={createGroup}
            className="w-full px-4 py-2 bg-green-500 text-white rounded"
          >
            Create Group
          </button>
        </div>
      </div>

      {/* Load Group Section */}
      <div className="border rounded-lg p-4 bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Load Group</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Group ID"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={loadGroup}
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            Load
          </button>
        </div>

        {currentGroup && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-bold">{currentGroup.groupName}</h3>
              <p className="text-gray-600">{currentGroup.groupDescription}</p>
            </div>

            <div className="h-96 overflow-y-auto border rounded p-4 bg-gray-50">
  {messages.map((msg, index) => (
    <div 
      key={index}
      className={`p-2 rounded mb-2 ${
        msg.fromDID === address 
          ? 'bg-blue-100 ml-auto' 
          : 'bg-gray-100'
      } max-w-[80%]`}
    >
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{msg.fromDID?.slice(0, 6)}...{msg.fromDID?.slice(-4)}</span>
        {msg.timestamp && !isNaN(new Date(msg.timestamp).getTime()) && (
          <span>{new Date(msg.timestamp).toLocaleString()}</span>
        )}
      </div>
      <div className="break-words whitespace-pre-wrap">
        {msg.content}
      </div>
    </div>
  ))}
</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-4 py-2 border rounded"
              />
              <button 
                onClick={sendMessage}
                className="px-6 py-2 bg-blue-500 text-white rounded"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PushGroupManager;