import React, { useState } from "react";
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import loginMutation from 'gql/login.graphql'

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loginFunction, { data, loading, error, client }] = useMutation(loginMutation, {
  });

  const onSubmit = async () => {
    const resonse = await loginFunction({ variables: { phone } });
    console.log("🚀 ~ onSubmit ~ resonse:", resonse)
    if (resonse?.data?.login?.name) {
      sessionStorage.setItem('currentUser', JSON.stringify(resonse?.data?.login))
      return navigate('/chat')
    }
  }

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  return (
    <div className="flex flex-col items-center my-8 mx-auto w-80 gap-4">
      <Input placeholder="phone" name="phone" onChange={(e) => { setPhone(e.target.value) }} />
      <Button onClick={onSubmit}>Login</Button>
    </div>
  )
}

export default Login;