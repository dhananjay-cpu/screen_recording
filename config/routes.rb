Rails.application.routes.draw do
  root 'recordings#new'
  get '/r/:key', to: 'recordings#show'
  resources :recordings
end
