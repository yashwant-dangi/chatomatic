import React, { useState } from "react";
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from "react-router-dom";

const loginMutation = gql`
mutation login($phone: String!) {
    login(phone: $phone) {
      id
      name
    }
  }
`;


function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loginFunction, { data, loading, error, client }] = useMutation(loginMutation, {
  });

  const onSubmit = async () => {
    const resonse = await loginFunction({ variables: { phone } });
    if (resonse?.data?.login?.name) {
      return navigate('/chat')
    }
  }

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;


  return (
    <div class="flex flex-col items-center my-8 mx-auto w-80 gap-4">
      <Input placeholder="phone" name="phone" onChange={(e) => { setPhone(e.target.value) }} />
      <Button onClick={onSubmit}>Login</Button>
    </div>
  )
}

export default Login;