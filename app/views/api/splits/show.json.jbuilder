json.split @split
if @split.receipt_photo_file_name
  json.receipt_photo @split.receipt_photo.url(:big)
end
json.users do
  json.array! @users
end
