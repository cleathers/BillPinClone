json.split @split
json.receipt_photo @split.receipt_photo.url(:big)
json.users do
  json.array! @users
end
